import { FormEvent, useState } from 'react'
import { api } from '../../utils/api'
import Select from 'react-select'
import { MultiValue } from 'react-select/dist/declarations/src'

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

  const { data: allCategories } = api.category.getAllCategories.useQuery()
  const { mutate: associateArticle } =
    api.article_category_relation.createRelation.useMutation({
      onSuccess: () => {
        if (pageIndex !== 2) setPageIndex((prev) => prev + 1)
        else setPageIndex(0)
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
      className='w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
    >
      <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
        Odaberi kategoriju artikla
      </h1>

      <div className='flex w-full flex-col items-center'>
        <label>Odaberi</label>
        <Select
          options={options}
          value={articleCategories}
          isMulti
          onChange={(option) => {
            if (option) setArticleCategories(option)
          }}
        />
      </div>

      <section>
        <button onSubmit={handleSubmit}>Dodaj</button>
      </section>
    </form>
  )
}

export default ArticleCategoryForm
