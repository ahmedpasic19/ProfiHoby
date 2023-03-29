import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { trpcClient } from '../../../../utils/api'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Image from 'next/image'
import * as Bs from 'react-icons/bs'

type TProps = {
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  article_id: string | null
  action_id: string | null
  navigateBack?: boolean
}
const UploadImageForm = ({
  setPageIndex,
  article_id,
  action_id,
  navigateBack,
}: TProps) => {
  const [articleImage, setArticleImage] = useState<string>('')
  const [file, setFile] = useState<File | undefined>(undefined)

  const router = useRouter()

  const queryClient = useQueryClient()

  const { data: images } = useQuery(
    ['image.getAllRelatedImages', { article_id, action_id }],
    () =>
      trpcClient.image.getAllRelatedImages.query({
        article_id: article_id || null,
        action_id: action_id || null,
      }),
    {
      enabled: article_id ? true : false,
    }
  )

  const { mutate: createImage } = useMutation(
    (input: { name: string; article_id: string; action_id: string }) =>
      trpcClient.image.createPresignedURL.mutate(input),
    {
      onSuccess: async (data) => {
        setArticleImage('')
        setFile(undefined)

        if (!file) return alert('No File')

        // fileds returned from S3 presigned URL
        const fileds: Record<string, unknown> = { ...data?.fields }
        const url: string | undefined = data?.url
        const fileData: Record<string, unknown> = {
          ...fileds,
          'Content-Type': file.type,
          file,
        }

        const formData = new FormData()
        for (const name in fileData) {
          const value = fileData[name]
          if (typeof value === 'string' || value instanceof Blob) {
            formData.append(name, value)
          }
        }
        if (!url) return alert('NO URL')

        await fetch(url, {
          method: 'POST',
          body: formData,
        })
          .then((res) => console.log(res))
          .catch((err) => console.log(err))

        await queryClient.invalidateQueries([
          'image.getAllRelatedImages',
          { article_id, action_id },
        ])
      },
    }
  )

  // Navigate user of the page if he has uploaded 8 images
  useEffect(() => {
    if (images?.length === 8) {
      router.push('/').catch(console.error)
      setPageIndex(0)
    }
  }, [images, setPageIndex, router])

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

    if (
      !file ||
      article_id === null ||
      article_id === undefined ||
      action_id === null ||
      action_id === undefined
    )
      return console.log('empty')

    createImage({
      article_id,
      action_id,
      name: file.name,
    })
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
        {/* Used in update images modal */}
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
        {images?.map((image) => (
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
