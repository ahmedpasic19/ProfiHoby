import { useEffect, useState, FormEvent } from 'react'
import { Dialog } from '@headlessui/react'
import Select, { MultiValue } from 'react-select'
import * as Ai from 'react-icons/ai'
import { Article, CategoriesOnArticle, Category, Image } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'

type TArticle = Article & {
  image: Image[]
  brand: {
    name: string
  } | null
  categories: (CategoriesOnArticle & {
    category: Category
  })[]
  attributes: { title: string; text: string; id: string }[]
}

type TProps = {
  article: TArticle
  isOpen: boolean
  setArticle: React.Dispatch<React.SetStateAction<TArticle>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type TMutiValueSelect = { value: string; label: string }

const UpdateArticleCategoriesModal = ({
  isOpen,
  article,
  setIsOpen,
  setArticle,
}: TProps) => {
  const [edited, setEdited] = useState(false)
  const [articleGroups, setArticleGroups] = useState(
    [] as MultiValue<TMutiValueSelect>
  )

  const onClose = () => {
    setIsOpen(false)
    setEdited(false)
    setArticle({} as TArticle)
    setArticleGroups([])
  }

  const queryClient = useQueryClient()

  const { data: DBarticle, refetch: fetchArticle } = useQuery(
    ['article.getArticle', { article_id: article.id }],
    () =>
      trpcClient.article.getArticle.query({
        article_id: article.id,
      }),
    {
      enabled: article.id ? true : false,
    }
  )

  const { refetch } = useQuery(['articleGroups.getAllRelations'], () =>
    trpcClient.articleGroups.getAllRelations.query()
  )

  // Temporary patch to deal with fetching on first load
  useEffect(() => {
    const fetch = async () => {
      await fetchArticle()
    }
    if (article.id) fetch().catch(console.error)
  }, [fetchArticle, article.id])

  const { mutate: updateRelation } = useMutation(
    (input: {
      article_id: string
      groups: {
        article_id: string
        group_id: string
      }[]
    }) => trpcClient.articleGroups.updateRelation.mutate(input),
    {
      onSuccess: async () => {
        await refetch()
        await queryClient.invalidateQueries(['article.getArticlesByGroupID'])
        await queryClient.invalidateQueries(['articles.getAllArticles'])
        await refetch()
        await queryClient.invalidateQueries([
          'article.getArticle',
          { article_id: article.id },
        ])
        onClose()
      },
    }
  )

  // Article groups before editing
  const currentArticleGroups = DBarticle?.groups.map((group) => ({
    label: group.group.name,
    value: group.group_id,
  }))

  // Getting goups only from article's selected categoriesF
  const options = DBarticle?.categories?.reduce((prev, curr) => {
    const groups = curr.category.groups?.map((group) => ({
      label: group.name,
      value: group.id,
    }))

    const newGroups = [...prev, ...groups]

    return newGroups
  }, [] as TMutiValueSelect[])

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    const data = articleGroups.map((option) => ({
      article_id: article.id,
      group_id: option.value,
    }))

    updateRelation({ article_id: article.id, groups: data })
    setArticleGroups([])
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className='fixed inset-0'>
        <div className='absolute h-full w-full bg-black/30' onClick={onClose} />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <form
            onSubmit={handleSubmit}
            className='relative min-h-[584px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
          >
            <h1 className='mt-4 w-full text-center text-2xl font-bold text-gray-800'>
              Odaberi grupe artikla
            </h1>

            <div className='mt-10 flex h-[63%] w-full flex-col items-center'>
              <label className='text-cl mb-2 w-4/5 text-start text-xl font-semibold text-gray-800'>
                Odaberi
              </label>
              <div className='mt-2 w-4/5'>
                <Select
                  options={options}
                  placeholder='Odaberi grupe'
                  isMulti
                  value={edited ? articleGroups : currentArticleGroups}
                  onChange={(optinsArr) => {
                    setArticleGroups(optinsArr)
                    setEdited(true)
                  }}
                />
              </div>
            </div>

            <section className='mt-10 flex w-full items-center justify-center'>
              <button
                onSubmit={handleSubmit}
                className='w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              >
                Sačuvaj
              </button>
            </section>
            <Ai.AiFillCloseCircle
              onClick={onClose}
              className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
            />
          </form>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default UpdateArticleCategoriesModal
