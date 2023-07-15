import { useState, FormEvent, useEffect, useCallback } from 'react'
import { trpcClient } from '../../../../utils/api'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useDropzone } from 'react-dropzone'

import Image from 'next/image'
import Spinner from '../../../mics/Spinner'
import { toast } from 'react-toastify'
import axios from 'axios'

type TProps = {
  setOpenAddArticle: React.Dispatch<React.SetStateAction<boolean>>
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  article_id: string | null
}

const UploadArticleImageForm = ({
  setOpenAddArticle,
  setPageIndex,
  article_id,
}: TProps) => {
  const [articleImage, setArticleImage] = useState<string>('')
  const [files, setFiles] = useState<File[] | undefined>(undefined)

  const router = useRouter()

  const queryClient = useQueryClient()

  // Publish article to OLX
  const postToOLX = async (article_id: string) => {
    try {
      await axios.post(`/api/olx/listings?id=${article_id}`)

      toast.success('Objavljeno na OLX')
    } catch (error) {
      toast.error('Došlo je do greške')
    }
  }

  const { data: images, isLoading: loadingFetchImages } = useQuery(
    ['image.getAllRelatedImages', { article_id }],
    () =>
      trpcClient.image.getAllRelatedImages.query({
        article_id: article_id || null,
      }),
    {
      enabled: article_id ? true : false,
    }
  )

  const { mutate: assignUrl, isLoading: loadingAssignURL } = useMutation(
    (input: { key: string; fileType: string }) =>
      trpcClient.image.generatePermanentAccessURL.mutate(input)
  )

  const { mutate: createImage, isLoading: loadingAddImage } = useMutation(
    (input: { name: string; article_id: string }) =>
      trpcClient.image.createPresignedURL.mutate(input),
    {
      onSuccess: async (data) => {
        setArticleImage('')
        setFiles(undefined)

        if (!files) return alert('No File')

        // fileds returned from S3 presigned URL
        const fileds: Record<string, unknown> = { ...data?.fields }
        const url: string | undefined = data?.url
        const fileData: Record<string, unknown> = {
          ...fileds,
          'Content-Type': files[0]?.type,
          file: files[0],
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
          .then(() => console.log('Success'))
          .catch(() => console.log('fail'))

        assignUrl(
          {
            key: data?.key || '',
            fileType: files[0]?.type !== undefined ? files[0]?.type : '',
          },
          {
            onSuccess: () => {
              queryClient
                .invalidateQueries([
                  'image.getAllRelatedImages',
                  { article_id },
                ])
                .catch(console.error)
            },
          }
        )
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

  // Select image function to state
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // set Files to state
    setFiles(acceptedFiles)

    // Display image when selected
    const selectedImageArray = Array.from(acceptedFiles)
    const imagesArray = selectedImageArray.map((file) => {
      return URL.createObjectURL(file)
    })

    if (!imagesArray[0]) return

    setArticleImage(imagesArray[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleUploadImage = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    if (!files || article_id === null || article_id === undefined)
      return console.error('Prvo dodajte artikal')

    createImage({
      article_id,
      name: files[0]?.name || '',
    })
  }

  // Display empty slots if array of images length is < 8
  const insertPlaceholderImages = (article_images: typeof images) => {
    if (article_images?.length === 0) {
      const images = new Array(8).fill('Placeholder image')
      return images as string[]
    } else {
      // Find the max length and images array
      const diff = 8 - (article_images?.length || 0)

      const filled_images = article_images?.concat(
        new Array(diff).fill('placeholder image')
      )
      return filled_images
    }
  }

  const image_slots = insertPlaceholderImages(images || [])

  return (
    <form onSubmit={handleUploadImage} className='w-3/4 p-10'>
      <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
        Dodaj dodaj sliku
      </h1>

      {/* Drag 'n' drop input */}
      <fieldset
        {...getRootProps()}
        className='mt-2 h-1/2 rounded-xl border-2 border-gray-800 text-lg font-semibold text-gray-800'
      >
        <input {...getInputProps()} />
        <div className='flex h-[300px] w-full cursor-pointer items-center justify-center'>
          <p>Povuci sliku ili klikni ovdije...</p>
        </div>
      </fieldset>

      {/* Display current selected image */}
      <div className='my-4 flex h-[40vh] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-gray-500 p-2'>
        {/* eslint-disable-next-line */}
        <img src={articleImage} className='h-full w-full object-cover' />
      </div>

      {/* Add btn */}
      <section className='mt-4 flex w-full items-center justify-evenly gap-2'>
        <button
          disabled={!files?.length}
          onSubmit={handleUploadImage}
          className='w-4/5 max-w-[200px] rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
        >
          Dodaj
        </button>
        <button
          onClick={() => {
            postToOLX(article_id as string).catch(console.error)
            setOpenAddArticle(false)
          }}
          className='w-4/5 max-w-[200px] rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
        >
          Završi
        </button>
      </section>

      {/* List of all selected images */}
      <div className='mt-5 grid w-full grid-cols-8 grid-rows-1 gap-1 overflow-x-auto pb-4'>
        {image_slots?.map((image, index) => {
          if (typeof image !== 'string')
            return (
              <div
                key={Math.random().toString()}
                className='flex h-full w-full items-center justify-center'
              >
                <Image
                  alt='article image'
                  src={image.access_url || ''}
                  width={300}
                  height={300}
                />
              </div>
            )
          else
            return (
              <div
                key={Math.random().toString()}
                className='relative z-20 flex h-full w-full animate-pulse items-center justify-center bg-gray-400 text-2xl text-transparent'
              >
                {loadingFetchImages || loadingAssignURL || loadingAddImage ? (
                  <Spinner />
                ) : (
                  index
                )}
              </div>
            )
        })}
      </div>
    </form>
  )
}

export default UploadArticleImageForm
