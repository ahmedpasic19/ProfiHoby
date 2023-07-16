import { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'
import { useRouter } from 'next/router'
import { Article, OrderArticle } from '@prisma/client'

import MainTable from '../../components/table/MainTable'
import DeleteOrderArticleModal from '../../components/modals/cart/DeleteOrderArticleModal'
import { FaTrash } from 'react-icons/fa'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import Image from 'next/image'

type TData = OrderArticle & {
  article: Article & {
    image: {
      access_url: string | null
    }[]
  }
}

type TRow = {
  original: TData
}

const Cart = () => {
  const [orderArticle, setOrderArticle] = useState({} as TData)
  const [openDelete, setOpenDelete] = useState(false)
  const [token, setToken] = useState('')

  const router = useRouter()

  useEffect(() => {
    const uniqueToken = localStorage.getItem('token') || ''
    setToken(uniqueToken)
  }, [])

  const { data: order } = useQuery(['order.getMyUnfinishedOrder'], () =>
    trpcClient.order.getMyUnfinishedOrder.query({
      token,
    })
  )

  const { data: orderArticles } = useQuery(
    ['orderArticle.getOrderArticles'],
    () =>
      trpcClient.orderArticle.getAllOrderArticles.query({
        order_id: order?.id || '',
      }),
    { enabled: order?.id ? true : false }
  )

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
      header: 'Količina',
      accessorKey: 'amount',
    },
    {
      header: 'Ukupno',
      accessorKey: 'totalPrice',
    },
    {
      header: 'Ukloni',
      accessorKey: 'actions',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex w-full justify-center'>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setOrderArticle(row.original)
              }}
            >
              <FaTrash className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
  ]

  const articles = useMemo(() => orderArticles || [], [orderArticles])

  // eslint-disable-next-line
  const columns = useMemo<ColumnDef<TData>[]>(() => workerColumns, [])

  const useData = () => {
    return articles ? articles : ([] as TData[])
  }

  const totalPrice = useMemo(
    () =>
      order?.articles?.reduce((prev, curr) => prev + curr.totalPrice, 0) || 0,
    [order?.articles]
  )

  const navigate = async () => {
    console.log(order?.id)
    if (totalPrice) await router.push(`/cart/${order?.id || ''}`)
  }

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center py-0 px-4 pt-0 sm:px-20'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Korpa
        </h1>

        <div className='relative flex w-full flex-col justify-center xl:flex-row'>
          <MainTable data={useData()} columns={columns} />
          <div className='flex w-full flex-col px-3 pt-5 sm:w-1/2 xl:pt-0'>
            <h3 className='mb-2 border-b-2 border-gray-300 text-xl font-semibold uppercase'>
              Ukupni proračun
            </h3>
            <span className='flex w-full justify-between'>
              <label>Ukupna cijena: </label>
              <span>{totalPrice}KM</span>
            </span>
            <span className='flex w-full justify-between'>
              <label>Cijena dostave: </label>
              <span>8KM</span>
            </span>
            <span className='flex w-full justify-between font-bold'>
              <label>Ukupno: </label>
              <span>{totalPrice + 8}KM</span>
            </span>
            <button
              onClick={navigate}
              className='my-2 w-full bg-blue-500 p-2 text-center font-bold text-white hover:bg-blue-600'
            >
              Završi narudžbu
            </button>
            <Link
              className='my-2 w-full bg-green-500 p-2 text-center text-white hover:bg-green-600'
              href='/'
            >
              Nastavi kupovinu
            </Link>
          </div>
        </div>
      </div>
      <DeleteOrderArticleModal
        article={orderArticle}
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        setArticle={setOrderArticle}
      />
    </>
  )
}

export default Cart
