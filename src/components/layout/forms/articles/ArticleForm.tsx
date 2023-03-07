import { Article } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormEvent, ChangeEvent } from 'react'
import { trpcClient } from '../../../../utils/api'

import FieldSet from '../../../Fieldset'
import Textarea from '../../../Textarea'

type TProps = {
  setArticleData: React.Dispatch<React.SetStateAction<Article>>
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  setArticleId: React.Dispatch<React.SetStateAction<string | null>>
  articleData: Article
  pageIndex: number
}

const ArticleForm = ({
  setArticleData,
  setPageIndex,
  setArticleId,
  articleData,
  pageIndex,
}: TProps) => {
  const queryClient = useQueryClient()

  const { mutate: postArticle } = useMutation(
    (input: { name: string; description: string; base_price: number }) =>
      trpcClient.article.createArticle.mutate(input),
    {
      onSuccess: async (data) => {
        setArticleId(data.id)
        setArticleData({} as Article)
        await queryClient.invalidateQueries([
          'articles',
          { category: '', name: '', pageSize: 100, pageIndex: 0 },
        ])
        if (pageIndex !== 2) setPageIndex((prev) => prev + 1)
        else setPageIndex(0)
      },
    }
  )

  const createArticle = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    if (
      !articleData.base_price ||
      !articleData.description ||
      !articleData.name
    )
      return
    articleData.base_price = parseFloat(articleData.base_price.toString())

    postArticle(articleData)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setArticleData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form
      onSubmit={createArticle}
      className='relative w-[500px] rounded-md bg-white p-10 drop-shadow-2xl'
    >
      <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
        Dodaj artikal
      </h1>
      <FieldSet
        value={articleData.name || ''}
        onChange={handleChange}
        name='name'
        label='Naziv'
        type='text'
      />
      <fieldset className='flex w-full flex-col items-center'>
        <label
          htmlFor='message'
          className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'
        >
          Opis artikla
        </label>
        <Textarea
          onChange={handleChange}
          rows={4}
          id='message'
          name='description'
          placeholder='Opišite artikal'
        />
      </fieldset>
      <FieldSet
        value={articleData.base_price || ''}
        onChange={handleChange}
        name='base_price'
        label='Cijena'
        type='number'
      />
      <section className='mt-10 flex w-full items-center justify-center'>
        <button
          disabled={
            !articleData.base_price ||
            !articleData.description ||
            !articleData.name
          }
          onSubmit={createArticle}
          className='w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
        >
          Dodaj
        </button>
      </section>
    </form>
  )
}

export default ArticleForm
