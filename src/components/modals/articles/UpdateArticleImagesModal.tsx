import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Article, CategoriesOnArticle, Image } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'

import UploadImageForm from '../../layout/forms/articles/UploadImageForm'
import ImageGrid from '../../layout/ImageGrid'
import * as Ai from 'react-icons/ai'
import * as Bs from 'react-icons/bs'

type TArticle = Article & {
  image: Image[]
  categories: CategoriesOnArticle[]
}

type TProps = {
  article: TArticle
  isOpen: boolean
  setArticle: React.Dispatch<React.SetStateAction<TArticle>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateArticleImagesModal = ({
  isOpen,
  article,
  setIsOpen,
  setArticle,
}: TProps) => {
  const [pageIndex, setPageIndex] = useState(0)

  const { data: article_images } = useQuery(
    ['image.getAllArricleImages', { article_id: article.id, action_id: null }],
    () =>
      trpcClient.image.getAllRelatedImages.query({
        article_id: article.id,
        action_id: null, // null because articleImage is NOT assigned with action
      }),
    {
      enabled: article.id ? true : false,
    }
  )

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setArticle({} as TArticle)
      }}
    >
      <div
        className='absolute h-full w-full bg-black/30'
        onClick={() => {
          setIsOpen(false)
          setArticle({} as TArticle)
        }}
      />
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setArticle({} as TArticle)
          }}
        />

        {pageIndex === 0 ? (
          <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
            <div className='flex h-[85%] w-4/5 flex-col justify-evenly rounded-xl bg-white p-10 drop-shadow-2xl'>
              <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
                Izmjeni slike
              </h1>

              <section className='h-[450px] w-full'>
                <ImageGrid
                  images={article_images || []}
                  articleId={article.id}
                  isDelete
                />
              </section>

              <section className='mt-5 flex w-full items-center justify-evenly'>
                <button className='w-4/5 max-w-[200px] rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'>
                  Sačuvaj
                </button>
                <button
                  onClick={() => setPageIndex(1)}
                  className='w-4/5 max-w-[200px] rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
                >
                  <Bs.BsArrowRight className='h-6 w-6' />
                </button>
              </section>
              <Ai.AiFillCloseCircle
                onClick={() => {
                  setIsOpen(false)
                  setArticle({} as TArticle)
                }}
                className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
              />
            </div>
          </main>
        ) : (
          <main className='flex h-full w-full items-center justify-center'>
            <UploadImageForm
              navigateBack
              article_id={article.id}
              action_id=''
              setPageIndex={setPageIndex}
            />
          </main>
        )}
      </Dialog.Panel>
    </Dialog>
  )
}

export default UpdateArticleImagesModal
