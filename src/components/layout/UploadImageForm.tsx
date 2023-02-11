import { useState, ChangeEvent, FormEvent } from 'react'
import { api } from '../../utils/api'
import * as Ai from 'react-icons/ai'

type TProps = {
  setArticleId: React.Dispatch<React.SetStateAction<string | null>>
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  pageIndex: number
  articleId: string | null
}
const UploadImageForm = ({
  setArticleId,
  setPageIndex,
  setIsOpen,
  articleId,
  pageIndex,
}: TProps) => {
  const [articleImage, setArticleImage] = useState<string | undefined>(
    undefined
  )

  const { mutate: addImage } = api.image.postArticleImage.useMutation({
    onSuccess: () => {
      setIsOpen(false)
      setArticleId(null)
      setArticleImage(undefined)
      if (pageIndex !== 2) setPageIndex((prev) => prev + 1)
      else setPageIndex(0)
    },
  })

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
    <form
      onSubmit={uploadImage}
      className='min-h-[584px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
    >
      <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
        Dodaj dodaj sliku
      </h1>

      <fieldset>
        <label>Odaberi sliku</label>
        <input type='file' onChange={onImageChange} />
      </fieldset>

      <div className='flex h-[300px] w-full items-center justify-center '>
        {/* eslint-disable-next-line */}
        <img src={articleImage} />
      </div>

      <section className='mt-14 flex w-full items-center justify-center'>
        <button
          disabled={!articleImage}
          onSubmit={uploadImage}
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

export default UploadImageForm
