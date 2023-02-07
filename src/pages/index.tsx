import { type NextPage } from 'next'
import { ChangeEvent, FormEvent, useState } from 'react'
import FieldSet from '../components/Fieldset'
import { Article } from '@prisma/client'
import { api } from '../utils/api'

const Home: NextPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [articleData, setArticleData] = useState({} as Article)
  const [articleId, setArticleId] = useState<string | null>(null)
  const [articleImage, setArticleImage] = useState<string | undefined>(
    undefined
  )

  const { mutate: postArticle } = api.article.createArticle.useMutation({
    onSuccess: (data) => {
      setArticleId(data.id)
      setArticleData({} as Article)
      if (pageIndex === 1) setPageIndex(0)
      else setPageIndex(1)
    },
  })
  const { mutate: addImage } = api.image.postArticleImage.useMutation({
    onSuccess: () => {
      setArticleId(null)
      setArticleImage(undefined)
      if (pageIndex === 1) setPageIndex(0)
      else setPageIndex(1)
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

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files?.[0]) return

    const selectedImage = e.currentTarget.files
    const selectedImageArray = Array.from(selectedImage)

    const imagesArray = selectedImageArray.map((file) => {
      return URL.createObjectURL(file)
    })

    setArticleImage(imagesArray[0])
  }

  const uploadImage = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()
    if (!articleId || !articleImage) return
    addImage({ article_id: articleId, name: '', image: articleImage })
  }

  return (
    <main className='flex h-full min-h-screen w-full items-center justify-center'>
      {pageIndex === 0 ? (
        <form
          onSubmit={createArticle}
          className='w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
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
        </form>
      ) : (
        <form
          onSubmit={uploadImage}
          className='min-h-[400px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
        >
          <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
            Dodaj dodaj sliku
          </h1>

          <fieldset>
            <label>Odaberi sliku</label>
            <input type='file' onChange={onImageChange} />
          </fieldset>

          <div className='flex h-[300px] w-full items-center justify-center '>
            <img src={articleImage} />
          </div>

          <section className='mt-10 flex w-full items-center justify-center'>
            <button
              disabled={!articleImage}
              onSubmit={uploadImage}
              className='w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
            >
              Dodaj
            </button>
          </section>
        </form>
      )}
    </main>
  )
}

export default Home
