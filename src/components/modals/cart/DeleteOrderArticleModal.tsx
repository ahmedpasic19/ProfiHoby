import { Dialog } from '@headlessui/react'
import { Article, OrderArticle } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import Spinner from '../../mics/Spinner'
import Image from 'next/image'
import { trpcClient } from '../../../utils/api'

type TData = OrderArticle & {
  article: Article & {
    image: {
      access_url: string | null
    }[]
  }
}

type TProps = {
  article: TData
  isOpen: boolean
  setArticle: React.Dispatch<React.SetStateAction<TData>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteOrderArticleModal = ({
  isOpen,
  article,
  setIsOpen,
  setArticle,
}: TProps) => {
  const queryClient = useQueryClient()

  const { mutate: deleteArticle, isLoading: isLoadingDelete } = useMutation(
    (input: { id: string }) =>
      trpcClient.orderArticle.deleteOrderArticle.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['orderArticle.getOrderArticles'])
        await queryClient.invalidateQueries(['order.getMyUnfinishedOrder'])
        setArticle({} as TData)
        setIsOpen(false)
      },
    }
  )

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setArticle({} as TData)
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setArticle({} as TData)
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <div className='flex h-full w-full flex-col justify-evenly overflow-y-auto rounded-xl bg-white p-10 drop-shadow-2xl sm:h-[80vh] sm:max-w-screen-sm'>
            <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
              Izbriši artikal
            </h1>
            <section className='flex flex-col'>
              <div className='flex w-full items-center justify-center'>
                <Image
                  alt='article image'
                  src={article?.article?.image?.at(0)?.access_url || ''}
                  width={300}
                  height={300}
                  className='object-contain'
                />
              </div>
              <h2 className='my-3 w-full text-center text-xl font-semibold uppercase'>
                {article?.article?.name}
              </h2>
              <div className='flex w-full flex-col items-center justify-center'>
                <div className='flex w-4/5 text-lg font-semibold'>
                  <label className='mr-2 w-full'>Cijena: </label>
                  <div>{article?.price}</div>
                </div>
                <div className='flex w-4/5 text-lg font-semibold'>
                  <label className='mr-2 w-full'>Ukupno: </label>
                  <div>{article?.totalPrice}</div>
                </div>
              </div>
            </section>
            <section className='mt-5 flex w-full items-center justify-center'>
              <button
                onClick={() => deleteArticle({ id: article.id })}
                className='flex w-4/5 items-center justify-center rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              >
                {isLoadingDelete ? <Spinner /> : 'Izbriši'}
              </button>
            </section>
          </div>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteOrderArticleModal
