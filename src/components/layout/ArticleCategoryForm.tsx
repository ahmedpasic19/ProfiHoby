import { FormEvent, useState } from 'react'
import { api } from '../../utils/api'
import { MultiValue } from 'react-select/dist/declarations/src'

import Select from 'react-select'
import * as Ai from 'react-icons/ai'

type TProps = {
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  articleId: string | null
  pageIndex: number
}

const ArticleCategoryForm = ({
  setPageIndex,
  setIsOpen,
  articleId,
  pageIndex,
}: TProps) => {
  const [articleCategories, setArticleCategories] = useState(
    [] as MultiValue<{ value: string; label: string }>
  )

  const utils = api.useContext()

  const { data: allCategories } = api.category.getAllCategories.useQuery()
  const { mutate: associateArticle } =
    api.article_category_relation.createRelation.useMutation({
      onSuccess: async () => {
        if (pageIndex !== 2) setPageIndex((prev) => prev + 1)
        else setPageIndex(0)
        await utils.article_category_relation.getAllRelations.invalidate()
        await utils.article.getAllArticles.invalidate()
      },
    })

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
            value={articleCategories}
            placeholder='Odaberi kategorije'
            isMulti
            onChange={(option) => {
              if (option) setArticleCategories(option)
            }}
          />
        </div>
      </div>

      <section className='mt-10 flex w-full items-center justify-center'>
        <button
          disabled={!articleCategories.length ? true : false}
          onSubmit={handleSubmit}
          className='w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
        >
          Dodaj
        </button>
      </section>

      <Ai.AiFillCloseCircle
        onClick={() => setIsOpen(false)}
        className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
      />
    </form>
  )
}

export default ArticleCategoryForm
