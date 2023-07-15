import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { trpcClient } from '../../../utils/api'
import { toast } from 'react-toastify'

import { AiFillCloseCircle } from 'react-icons/ai'
import { Dialog } from '@headlessui/react'
import Spinner from '../../mics/Spinner'
import Image from 'next/image'
import { useRouter } from 'next/router'

type TProps = {
  amount: number
  sellingPrice: number
  articleId: string
  articleName: string
  basePrice: number
  image: string
  isOpen: boolean
  onDiscount: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddToCart = ({
  sellingPrice,
  amount,
  articleId,
  articleName,
  basePrice,
  image,
  isOpen,
  onDiscount,
  setIsOpen,
}: TProps) => {
  const [finish, setFinish] = useState(false)

  const router = useRouter()

  const queryClient = useQueryClient()

  // This token is generated when user first enters the page
  // Check "useGrantUserToken.ts" hook
  const uniqueToken = localStorage.getItem('token') || ''

  const { mutate: addArticle, isLoading: loadingAdd } = useMutation(
    (input: {
      amount: number
      price: number
      article_id: string
      token: string
    }) => trpcClient.orderArticle.createOrderAndOrderArticle.mutate(input),
    {
      onSuccess: async (data) => {
        setIsOpen(false)
        toast.info('Artikal dodan u korpu')
        await queryClient.invalidateQueries(['order.getAllOrders'])
        await queryClient.invalidateQueries(['order.getMyUnfinishedOrder'])
        await queryClient.invalidateQueries(['orderArticle.getOrderArticles'])

        localStorage.removeItem('token')

        if (finish) {
          await router.push(`/cart/${data.id}`)
        }
      },
    }
  )

  const addOrderArticle = () => {
    if (!articleId) return toast.error('Došlo je do greške')
    if (!articleId)
      return toast.info('Molimo vas osviježite stranicu i pokušajte ponovo')

    addArticle({
      amount,
      price: basePrice,
      article_id: articleId,
      token: uniqueToken,
    })
  }

  const finishPayment = () => {
    if (!articleId) return toast.error('Došlo je do greške')
    if (!articleId)
      return toast.info('Molimo vas osviježite stranicu i pokušajte ponovo')

    setFinish(true)
    addArticle({
      amount,
      price: basePrice,
      article_id: articleId,
      token: uniqueToken,
    })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
    >
      <Dialog.Panel className='fixed inset-0 z-50'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <div className='relative z-30 flex h-full max-h-80 w-full max-w-5xl flex-col justify-between rounded-md bg-white p-2 text-center text-xl font-semibold text-gray-800'>
            <label className='upp mt-2 w-full pl-5 text-start font-bold uppercase'>
              Dodajte u korpu
            </label>

            <div className='flex w-full items-start justify-start px-3'>
              <div>
                <Image
                  alt='article image'
                  src={image}
                  width={100}
                  height={100}
                  className='h-full w-full object-contain'
                />
              </div>
              <section className='flex h-full w-full flex-col items-start pl-5 uppercase'>
                <h1 className='mb-2 w-full text-start text-xl font-semibold text-gray-800'>
                  {articleName}
                </h1>
                <div className='flex w-full max-w-md justify-start'>
                  <label className='mr-2 text-start text-base tracking-wide'>
                    Količina:
                  </label>
                  <p className='text-base'>{amount}</p>
                </div>
                <div className='flex w-full max-w-md justify-start'>
                  <label className='mr-2 text-start text-base tracking-wide'>
                    Cijena:
                  </label>
                  <p className='text-base'>{basePrice}KM</p>
                  {onDiscount ? (
                    <p className='ml-2 text-base text-red-600'>
                      {' '}
                      -{(amount * (basePrice - sellingPrice)).toFixed(2)}KM
                    </p>
                  ) : null}
                </div>
                <div className='flex w-full max-w-md justify-start'>
                  <label className='mr-2 text-start text-base tracking-wide'>
                    Ukupno:
                  </label>
                  <p className='text-base'>
                    {(sellingPrice * amount).toFixed(2)}KM
                  </p>
                </div>
              </section>
            </div>

            <section className='flex w-full justify-between p-2 text-base'>
              <div>
                <button
                  disabled={finish}
                  onClick={addOrderArticle}
                  className='mt-3 flex w-full items-center justify-center rounded-sm bg-gray-800 p-2 text-white drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)] hover:bg-gray-700 disabled:bg-gray-600'
                >
                  {finish ? (
                    'Nastavak kupovine'
                  ) : loadingAdd ? (
                    <Spinner />
                  ) : (
                    'Nastavak kupovine'
                  )}
                </button>
              </div>
              <div className='flex gap-4'>
                <button className='mt-3 rounded-sm bg-white p-2 font-semibold drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)] hover:bg-gray-100'>
                  Pregled korpe
                </button>
                <button
                  onClick={finishPayment}
                  className='mt-3 rounded-sm bg-gray-800 p-2 text-white drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)] hover:bg-gray-700'
                >
                  {!finish ? (
                    'Zaključi prodaju'
                  ) : loadingAdd ? (
                    <Spinner />
                  ) : (
                    'Zaključi prodaju'
                  )}
                </button>
              </div>
            </section>

            <AiFillCloseCircle
              onClick={() => {
                setIsOpen(false)
              }}
              className='absolute top-4 right-4 block h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800 sm:hidden'
            />
          </div>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default AddToCart
