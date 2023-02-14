import { FormEvent, useState } from 'react'
import { Dialog } from '@headlessui/react'
import Select, { MultiValue } from 'react-select'
import { api } from '../../../utils/api'
import * as Ai from 'react-icons/ai'
import { Article, CategoriesOnArticle, Image } from '@prisma/client'

type TArticle = Article & {
  image: Image[]
  categories: CategoriesOnArticle[]
}

type TProps = {
  article: TArticle
  isOpen: boolean
  setArticle: React.Dispatch<React.SetStateAction<TArticle>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateArticleCategoriesModal = ({
  isOpen,
  article,
  setIsOpen,
  setArticle,
}: TProps) => {
  const [edited, setEdited] = useState(false)
  const [newArticleCategories, setNewArticleCategories] = useState<
    MultiValue<{ label: string; value: string }>
  >([])

  const utils = api.useContext()

  const { data: allCategories } = api.category.getAllCategories.useQuery()

  const { data: allArticleCategories } =
    api.article_category_relation.getArticleCategories.useQuery(
      {
        article_id: article?.id,
        categories: article?.categories?.map(
          (category) => category.category_id
        ),
      },
      {
        enabled: Object.keys(article).length ? true : false,
      }
    )

  const { mutate: upateRelation } =
    api.article_category_relation.updateRelation.useMutation({
      onSuccess: async () => {
        await utils.article_category_relation.getAllRelations.invalidate()
        await utils.article.getAllArticles.invalidate()
        setArticle({} as TArticle)
        setIsOpen(false)
      },
    })

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    const newRelation = newArticleCategories.map((category) => ({
      category_id: category.value,
      article_id: article.id,
    }))

    upateRelation({ article_id: article.id, categories: newRelation })
  }

  const articleCategories = allArticleCategories?.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  const options = allCategories?.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setArticle({} as TArticle)
        setNewArticleCategories([])
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setArticle({} as TArticle)
            setNewArticleCategories([])
          }}
        />
        <Dialog.Title>Izbriši artikal</Dialog.Title>

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <form
            onSubmit={handleSubmit}
            className='relative min-h-[584px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
          >
            <h1 className='mt-4 w-full text-center text-2xl font-bold text-gray-800'>
              Odaberi kategorije artikla
            </h1>

            <div className='mt-10 flex h-[63%] w-full flex-col items-center'>
              <label className='text-cl mb-2 w-4/5 text-start text-xl font-semibold text-gray-800'>
                Odaberi
              </label>
              <div className='mt-2 w-4/5'>
                <Select
                  options={options}
                  placeholder='Odaberi kategorije'
                  isMulti
                  value={edited ? newArticleCategories : articleCategories}
                  onChange={(optinsArr) => {
                    setNewArticleCategories(optinsArr)
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
              onClick={() => {
                setIsOpen(false)
                setArticle({} as TArticle)
                setNewArticleCategories([])
              }}
              className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
            />
          </form>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default UpdateArticleCategoriesModal
