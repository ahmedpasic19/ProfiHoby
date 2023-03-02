import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { trpcClient } from '../../utils/api'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Image from 'next/image'
import * as Bs from 'react-icons/bs'

type TProps = {
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  articleId: string | null
  navigateBack?: boolean
}
const UploadImageForm = ({ setPageIndex, articleId, navigateBack }: TProps) => {
  const [articleImage, setArticleImage] = useState<string>('')
  const [file, setFile] = useState<File | undefined>(undefined)

  const router = useRouter()

  const queryClient = useQueryClient()

  const { data: articleImages } = useQuery(
    ['image.getAllArricleImages', { id: articleId }],
    () => trpcClient.image.getAllArticleImages.query({ id: articleId || '' }),
    {
      enabled: articleId ? true : false,
    }
  )

  const { mutate: addArticleImage } = useMutation(
    (input: { name: string; article_id: string }) =>
      trpcClient.image.createPresignedURL.mutate(input),
    {
      onSuccess: async (data) => {
        setArticleImage('')
        setFile(undefined)

        if (!file) return alert('No File')

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
        if (!url) return alert('NO URL')

        await fetch(url, {
          method: 'POST',
          body: formData,
        })
          .then((res) => console.log(res))
          .catch((err) => console.log(err))

        await queryClient.invalidateQueries([
          'image.getAllArricleImages',
          { id: articleId },
        ])
      },
    }
  )

  useEffect(() => {
    if (articleImages?.length === 8) {
      router.push('/').catch(console.error)
      setPageIndex(0)
    }
  }, [articleImages, setPageIndex, router])

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files?.[0]) return

    const selectedImage = e.currentTarget.files
    const selectedImageArray = Array.from(selectedImage)

    const imagesArray = selectedImageArray.map((file) => {
      return URL.createObjectURL(file)
    })

    setFile(e.currentTarget.files?.[0])
    if (!imagesArray[0]) return
    setArticleImage(imagesArray[0])
  }

  const handleUploadImage = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()
    if (!file || !articleId) return

    addArticleImage({ article_id: articleId, name: file.name })
  }

  return (
    <form
      onSubmit={handleUploadImage}
      className='min-h-[484px] w-[550px] rounded-xl bg-white p-10 drop-shadow-2xl'
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

      <section className='mt-14 flex w-full items-center justify-evenly'>
        <button
          disabled={!file}
          onSubmit={handleUploadImage}
          className='w-4/5 max-w-[200px] rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
        >
          Dodaj
        </button>
        {navigateBack && (
          <button
            onClick={() => setPageIndex(0)}
            className='w-4/5 max-w-[200px] rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
          >
            <Bs.BsArrowRight className='h-6 w-6 rotate-180' />
          </button>
        )}
      </section>

      <div className='mt-5 grid w-full grid-cols-8 grid-rows-1 gap-2 overflow-x-auto'>
        {articleImages?.map((image) => (
          <div
            key={Math.random().toString()}
            className='flex h-full w-full items-center justify-center'
          >
            <Image
              alt='article image'
              src={image.url}
              width={300}
              height={300}
            />
          </div>
        ))}
      </div>
    </form>
  )
}

export default UploadImageForm
