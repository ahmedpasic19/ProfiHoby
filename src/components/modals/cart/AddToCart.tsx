import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
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
  const [token, setToken] = useState('')

  const router = useRouter()

  const queryClient = useQueryClient()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token || '')
  }, [token])

  const { mutate: addArticle, isLoading: loadingAdd } = useMutation(
    (input: {
      amount: number
      price: number
      article_id: string
      token: string
    }) => trpcClient.orderArticle.createOrderAndOrderArticle.mutate(input),
    {
      onSuccess: async () => {
        setIsOpen(false)
        toast.info('Artikal dodan u korpu')
        await queryClient.invalidateQueries(['order.getAllOrders'])
        await queryClient.invalidateQueries(['order.getMyUnfinishedOrder'])
        await queryClient.invalidateQueries(['orderArticle.getOrderArticles'])
      },
    }
  )

  const { mutate: finishOrder, isLoading: loadingFinish } = useMutation(
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

        await router.push(`/cart/${data.id}`)
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
      token,
    })
  }

  const finishPayment = () => {
    if (!articleId) return toast.error('Došlo je do greške')
    if (!articleId)
      return toast.info('Molimo vas osviježite stranicu i pokušajte ponovo')

    finishOrder({
      amount,
      price: basePrice,
      article_id: articleId,
      token,
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

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center '>
          <div className='relative z-30 flex h-screen w-full max-w-5xl flex-col justify-between bg-white p-2 text-center text-xl font-semibold text-gray-800 sm:h-full sm:max-h-80 sm:rounded-md md:w-3/4 lg:w-4/5 xl:w-full'>
            <label className='upp mt-2 flex w-full pl-5 text-start font-bold uppercase'>
              <p>Dodajte u </p>
              <strong className='ml-2 text-main'>korpu</strong>
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
                <h1 className='mb-2 w-full text-start text-xl font-semibold text-main'>
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
                  <p className='text-base'>
                    {basePrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    KM
                  </p>
                  {onDiscount ? (
                    <p className='ml-2 text-base text-red-600'>
                      {' '}
                      -
                      {(amount * (basePrice - sellingPrice)).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                      KM
                    </p>
                  ) : null}
                </div>
                <div className='flex w-full max-w-md justify-start'>
                  <label className='mr-2 text-start text-base tracking-wide'>
                    Ukupno:
                  </label>
                  <p className='text-base'>
                    {(sellingPrice * amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    KM
                  </p>
                </div>
              </section>
            </div>

            <section className='flex w-full flex-col justify-between p-2 text-base sm:flex-row'>
              <div>
                <button
                  disabled={loadingFinish}
                  onClick={addOrderArticle}
                  className='mt-3 flex w-full items-center justify-center rounded-sm bg-main p-2 uppercase text-white drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)] hover:bg-main/80 disabled:bg-main/80'
                >
                  {loadingFinish ? (
                    'Nastavak kupovine'
                  ) : loadingAdd ? (
                    <Spinner />
                  ) : (
                    'Nastavak kupovine'
                  )}
                </button>
              </div>
              <div className='flex w-full justify-evenly gap-4 sm:w-fit'>
                <button className='mt-3 rounded-sm bg-gray-800 p-2 font-semibold uppercase text-white drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)] hover:bg-gray-100'>
                  Pregled korpe
                </button>
                <button
                  onClick={finishPayment}
                  className='mt-3 rounded-sm bg-main p-2 uppercase text-white drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)] hover:bg-main/80'
                >
                  {!loadingFinish ? (
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
