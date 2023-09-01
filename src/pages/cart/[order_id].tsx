import { ChangeEvent, FormEvent, useState, useMemo } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { trpcClient } from '../../utils/api'
import { Article, OrderArticle } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'react-toastify'

import FieldSet from '../../components/mics/Fieldset'
import Textarea from '../../components/mics/Textarea'
import Spinner from '../../components/mics/Spinner'
import MainTable from '../../components/table/MainTable'
import Image from 'next/image'

import Pixel from '../../components/Pixel'

type TData = {
  firstName: string
  lastName: string
  phone_number: string
  address: string
  note: string
}

type TArticleData = OrderArticle & {
  article: Article & {
    image: {
      access_url: string | null
    }[]
  }
}

type TRow = {
  original: TArticleData
}

const OrderInformation = () => {
  const [orderData, setOrderData] = useState({} as TData)

  const router = useRouter()
  const { order_id } = router.query

  const queryClient = useQueryClient()

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setOrderData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const { data: orderArticles } = useQuery(
    ['orderArticle.getOrderArticles'],
    () =>
      trpcClient.orderArticle.getAllOrderArticles.query({
        order_id: typeof order_id === 'string' ? order_id : '',
      }),
    {
      enabled: order_id ? true : false,
    }
  )

  const { mutate: updateOrder, isLoading } = useMutation(
    (input: TData & { id: string; isLocked: boolean }) =>
      trpcClient.order.updateOrder.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['order.getAllOrders'])
        await queryClient.invalidateQueries(['order.getMyUnfinishedOrder'])
        await queryClient.invalidateQueries(['order.getAllLockedOrders'])
        await queryClient.invalidateQueries(['orderArticle.getOrderArticles'])
      },
    }
  )

  const handleSubbmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!orderData.firstName) return toast.error('Upišite Ime')
    if (!orderData.lastName) return toast.error('Upišite Prezime')
    if (!orderData.address) return toast.error('Upišite adresu')

    updateOrder({ ...orderData, id: order_id as string, isLocked: true })

    await router.push('/')

    toast.success('Narudžba poslana')
  }

  const workerColumns = [
    {
      header: 'Prikaz',
      accessorKey: 'picture',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex w-full items-center justify-center'>
            <Image
              alt='article image'
              src={row.original.article.image.at(0)?.access_url || ''}
              width={100}
              height={100}
              className='object-contain'
            />
          </div>
        )
      },
    },
    {
      header: 'Proizvod',
      accessorKey: 'article.name',
    },
    {
      header: 'Cijena',
      accessorKey: 'price',
    },
    {
      header: 'Ukupno',
      accessorKey: 'totalPrice',
    },
  ]

  const articles = useMemo(() => orderArticles || [], [orderArticles])

  // eslint-disable-next-line
  const columns = useMemo<ColumnDef<TArticleData>[]>(() => workerColumns, [])

  const useData = () => {
    return articles ? articles : ([] as TArticleData[])
  }

  return (
    <>
      <Pixel name='FACEBOOK_PIXEL_1' />

      <div className='flex h-full min-h-screen w-full flex-col items-center justify-center px-4 py-0 pt-0 sm:px-20'>
        <h1 className='mb-5 w-full text-center text-[3em] font-bold text-gray-800'>
          Upotpunite narudžbu
        </h1>
        <form onSubmit={handleSubbmit} className='w-full max-w-2xl'>
          <FieldSet
            value={orderData.firstName || ''}
            onChange={handleChange}
            name='firstName'
            label='Ime'
            type='text'
          />
          <FieldSet
            value={orderData.lastName || ''}
            onChange={handleChange}
            name='lastName'
            label='Prezime'
            type='text'
          />
          <FieldSet
            value={orderData.address || ''}
            onChange={handleChange}
            name='address'
            label='Adresa'
            type='text'
          />
          <FieldSet
            value={orderData.phone_number || ''}
            onChange={handleChange}
            name='phone_number'
            label='Broj telefona'
            type='text'
          />
          <fieldset className='flex w-full flex-col items-center'>
            <label
              htmlFor='note'
              className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'
            >
              Napomena
            </label>
            <Textarea
              onChange={handleChange}
              rows={4}
              id='note'
              name='note'
              placeholder='Napomena'
            />
          </fieldset>

          <section className='mt-10 flex w-full items-center justify-center pb-10'>
            <button
              disabled={
                !orderData.address ||
                !orderData.firstName ||
                !orderData.lastName
              }
              onSubmit={handleSubbmit}
              className='flex w-4/5 items-center justify-center rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
            >
              {isLoading ? <Spinner /> : 'Naruči'}
            </button>
          </section>
        </form>
        <div className='hidden sm:block'>
          <MainTable data={useData()} columns={columns} />
        </div>
      </div>
    </>
  )
}

export default OrderInformation
