import { useState, ChangeEvent, FormEvent } from 'react'
import { api } from '../../utils/api'
import * as Ai from 'react-icons/ai'

type TProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  articleId: string | null
}
const UploadImageForm = ({ setIsOpen, articleId }: TProps) => {
  const [articleImage, setArticleImage] = useState<string | undefined>(
    undefined
  )
  const [file, setFile] = useState<File | undefined>(undefined)

  const { data, refetch } = api.image.createPresignedURL.useQuery(
    {
      name: file?.name ? file?.name : '',
      article_id: articleId ? articleId : '',
    },
    { enabled: file?.name && articleId ? true : false }
  )

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files?.[0]) return

    const selectedImage = e.currentTarget.files
    const selectedImageArray = Array.from(selectedImage)

    const imagesArray = selectedImageArray.map((file) => {
      return URL.createObjectURL(file)
    })

    setFile(e.currentTarget.files?.[0])
    setArticleImage(imagesArray[0])
  }

  const handleUploadImage = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault()
    if (!file || !data) return
    await refetch()

    const fileds = { ...data?.fields }
    const url = data?.url
    const fileData = {
      ...fileds,
      'Content-Type': file.type,
      file,
    }

    const formData = new FormData()
    for (const name in fileData) {
      formData.append(name, fileData[name])
    }

    await fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))

    setIsOpen(false)
  }

  return (
    <form
      onSubmit={handleUploadImage}
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
          disabled={!file}
          onSubmit={handleUploadImage}
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
