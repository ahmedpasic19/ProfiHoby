import { useMemo } from 'react'
import { Dialog } from '@headlessui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'
import { Article, Order, OrderArticle } from '@prisma/client'
import { toast } from 'react-toastify'

import Spinner from '../../mics/Spinner'
import MainTable from '../../table/MainTable'
import UnoptimizedImage from '../../mics/UnoptimizedImage'
import { ColumnDef } from '@tanstack/react-table'

type TData = Order

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

type TProps = {
  orderNote: string
  order_id: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setOrder: React.Dispatch<React.SetStateAction<TData>>
}

const FinishOrderModal = ({
  orderNote,
  order_id,
  isOpen,
  setIsOpen,
  setOrder,
}: TProps) => {
  const queryClient = useQueryClient()

  const { mutate: finishOrder, isLoading: loadingFinish } = useMutation(
    () => trpcClient.order.finishOrder.mutate({ id: order_id }),
    {
      onSuccess: async () => {
        setIsOpen(false)
        setOrder({} as TData)
        toast.success('Narzdžba završena')
        await queryClient.invalidateQueries(['order.getAllLockedOrders'])
        await queryClient.invalidateQueries(['order.getAllOrders'])
      },
    }
  )

  const handleFinish = () => finishOrder()

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

  const workerColumns = [
    {
      header: 'Prikaz',
      accessorKey: 'picture',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex w-full items-center justify-center'>
            <UnoptimizedImage
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
      header: 'Količina',
      accessorKey: 'amount',
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

  const onClose = () => {
    setIsOpen(false)
    setOrder({} as TData)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute z-30 h-full w-full bg-black/30'
          onClick={onClose}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <div className='z-30 flex h-full w-full flex-col items-center justify-between rounded-xl bg-white p-4 text-center text-xl font-semibold text-gray-800'>
            <div className='pt-10'>
              <h1 className='mb-5 w-full text-center text-2xl font-bold text-gray-800'>
                Završi narudžbu
              </h1>
              <MainTable data={useData()} columns={columns} />
            </div>

            <textarea
              value={orderNote}
              placeholder='Napomena'
              readOnly
              className='h-full w-4/5 resize-none rounded-md border-2 border-gray-200 p-4 outline-none'
            ></textarea>

            <section className='flex w-full justify-evenly pb-5'>
              <button
                onClick={handleFinish}
                className='mt-3 flex w-1/4 items-center justify-center rounded-md bg-white p-4 drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)]'
              >
                {loadingFinish ? <Spinner /> : 'Zarvši'}
              </button>
              <button
                onClick={onClose}
                className='mt-3 flex w-1/4 items-center justify-center rounded-md bg-white p-4 drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)]'
              >
                Odustani
              </button>
            </section>
          </div>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default FinishOrderModal
