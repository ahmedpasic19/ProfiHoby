import { FormEvent, useState } from 'react'
import { trpcClient } from '../../../../utils/api'
import { MultiValue } from 'react-select/dist/declarations/src'

import Select from 'react-select'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type TProps = {
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  articleId: string | null
  pageIndex: number
}

const ArticleCategoryForm = ({
  setPageIndex,
  articleId,
  pageIndex,
}: TProps) => {
  const [articleCategories, setArticleCategories] = useState(
    [] as MultiValue<{ value: string; label: string }>
  )

  const queryClient = useQueryClient()

  const { refetch } = useQuery(['article_category_relation'], () =>
    trpcClient.article_category_relation.getAllRelations.query()
  )

  const { data: allCategories } = useQuery(['categories'], () =>
    trpcClient.category.getAllCategories.query()
  )

  const { mutate: associateArticle } = useMutation(
    (
      input: {
        article_id: string
        category_id: string
      }[]
    ) => trpcClient.article_category_relation.createRelation.mutate(input),
    {
      onSuccess: async () => {
        if (pageIndex !== 2) setPageIndex((prev) => prev + 1)
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

  const options = allCategories?.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    if (!articleId) return

    const data = articleCategories.map((option) => ({
      article_id: articleId,
      category_id: option.value,
    }))

    associateArticle(data)
    setArticleCategories([])
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='relative min-h-[484px] w-[550px] rounded-xl bg-white p-10 drop-shadow-2xl'
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
            value={articleCategories}
            placeholder='Odaberi kategorije'
            isMulti
            onChange={(option) => {
              if (option) setArticleCategories(option)
            }}
          />
        </div>

        <section className='mt-10 flex w-full items-center justify-center'>
          <button
            disabled={!articleCategories.length ? true : false}
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

export default ArticleCategoryForm
