import { Article } from '@prisma/client'
import { FormEvent, ChangeEvent } from 'react'
import { api } from '../../utils/api'
import FieldSet from '../Fieldset'
import * as Ai from 'react-icons/ai'

type TProps = {
  setArticleData: React.Dispatch<React.SetStateAction<Article>>
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setArticleId: React.Dispatch<React.SetStateAction<string | null>>
  articleData: Article
  pageIndex: number
}

const ArticleForm = ({
  setIsOpen,
  setArticleData,
  setPageIndex,
  setArticleId,
  articleData,
  pageIndex,
}: TProps) => {
  const utils = api.useContext()

  const { mutate: postArticle } = api.article.createArticle.useMutation({
    onSuccess: async (data) => {
      setArticleId(data.id)
      setArticleData({} as Article)
      await utils.article.getAllArticles.invalidate()
      if (pageIndex !== 2) setPageIndex((prev) => prev + 1)
      else setPageIndex(0)
    },
  })

  const createArticle = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    if (
      !articleData.base_price ||
      !articleData.description ||
      !articleData.name
    )
      return
    articleData.base_price = parseFloat(articleData.base_price.toString())
    articleData.discount = parseFloat(
      articleData?.discount ? articleData?.discount?.toString() : '0'
    )
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
      className='relative w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
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
        <textarea
          onChange={handleChange}
          rows={4}
          id='message'
          name='description'
          className='block w-4/5 rounded-lg border-2 border-gray-800 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
          placeholder='Opišite artikal'
        ></textarea>
      </fieldset>
      <FieldSet
        value={articleData.base_price || ''}
        onChange={handleChange}
        name='base_price'
        label='Cijena'
        type='number'
      />
      <FieldSet
        value={articleData?.discount || ''}
        onChange={handleChange}
        name='discount'
        label='Rabat'
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
      <Ai.AiFillCloseCircle
        onClick={() => setIsOpen(false)}
        className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
      />
    </form>
  )
}

export default ArticleForm
