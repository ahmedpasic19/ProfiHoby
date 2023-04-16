import { FormEvent, useState, useEffect } from 'react'
import { trpcClient } from '../../../../utils/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Select, { MultiValue } from 'react-select'

type TProps = {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  articleId: string | null
  pageIndex: number
}

type TMutiValueSelect = { value: string; label: string }

const ArticleGroupFrom = ({ setPageIndex, articleId, pageIndex }: TProps) => {
  const [articleGroups, setArticleGroups] = useState(
    [] as MultiValue<TMutiValueSelect>
  )

  const queryClient = useQueryClient()

  const { refetch } = useQuery(['articleGroups.getAllRelations'], () =>
    trpcClient.articleGroups.getAllRelations.query()
  )

  const { data: article, refetch: fetchArticle } = useQuery(
    ['article.getArticle'],
    () =>
      trpcClient.article.getArticle.query({
        article_id: articleId || '',
      }),
    {
      enabled: articleId ? true : false,
    }
  )

  // Temporary patch to deal with fetching on first load
  useEffect(() => {
    const fetch = async () => {
      await fetchArticle()
    }
    fetch().catch(console.error)
  }, [fetchArticle])

  const { mutate: associateArticle } = useMutation(
    (
      input: {
        article_id: string
        group_id: string
      }[]
    ) => trpcClient.articleGroups.createRelation.mutate(input),
    {
      onSuccess: async () => {
        if (pageIndex === 2) setPageIndex((prev) => prev + 1)
        else setPageIndex(0)
        await refetch()
        await queryClient.invalidateQueries([
          'articles',
          {
            pageSize: 100,
            pageIndex: 0,
            name: '',
            category: 'article.index.page',
          },
        ])
      },
    }
  )

  // Getting goups only from article's selected categoriesF
  const options = article?.categories?.reduce((prev, curr) => {
    const groups = curr.category.groups?.map((group) => ({
      label: group.name,
      value: group.id,
    }))

    const newGroups = [...prev, ...groups]

    return newGroups
  }, [] as TMutiValueSelect[])

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    if (!articleId) return

    const data = articleGroups.map((option) => ({
      article_id: articleId,
      group_id: option.value,
    }))

    associateArticle(data)
    setArticleGroups([])
  }

  return (
    <form onSubmit={handleSubmit} className='relative w-3/4 p-10'>
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
            value={articleGroups}
            placeholder='Odaberi grupe'
            isMulti
            onChange={(option) => {
              if (option) setArticleGroups(option)
            }}
          />
        </div>

        <section className='mt-10 flex w-full items-center justify-center'>
          <button
            disabled={!articleGroups.length ? true : false}
            onSubmit={handleSubmit}
            className='relative bottom-0 w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
          >
            Dodaj
          </button>
        </section>
      </div>
    </form>
  )
}

export default ArticleGroupFrom
