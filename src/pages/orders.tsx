import { NextPage } from 'next'
import { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'
import { Order } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'

import MainTable from '../components/table/MainTable'

import Select from 'react-select'
import { FaTrash } from 'react-icons/fa'
import { AiOutlineSend } from 'react-icons/ai'
import FinishOrderModal from '../components/modals/order/FinishOrderModal'
import DeleteOrderModal from '../components/modals/order/DeleteOrderModal'

type TData = Order

type TRow = {
  original: TData
}

const Orders: NextPage = () => {
  const [order, setOrder] = useState({} as TData)
  const [openFinish, setOpenFinish] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [fetchFinished, setFetchFinished] = useState({
    label: 'Nezaključene',
    value: false,
  })

  const { data: allOrders, refetch } = useQuery(['order.getAllOrders'], () =>
    trpcClient.order.getAllLockedOrders.query({ finished: fetchFinished.value })
  )

  useEffect(() => {
    refetch().catch(console.error)
  }, [fetchFinished.value])

  const workerColumns = [
    {
      header: 'Šifra',
      accessorKey: 'id',
    },
    {
      header: 'Ukupno',
      accessorKey: 'price',
    },
    {
      header: 'Addresa dostave',
      accessorKey: 'address',
    },
    {
      header: 'Broj telefona',
      accessorKey: 'phone_number',
    },
    {
      header: 'Akcije',
      accessorKey: 'actions',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex w-full justify-evenly'>
            {!fetchFinished.value && (
              <button
                className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
                onClick={() => {
                  setOrder(row.original)
                  setOpenFinish(true)
                }}
              >
                <AiOutlineSend className='h-8 w-8' />
              </button>
            )}
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOrder(row.original)
                setOpenDelete(true)
              }}
            >
              <FaTrash className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
  ]

  const data = useMemo(() => allOrders || [], [allOrders])

  // eslint-disable-next-line
  const columns = useMemo<ColumnDef<TData>[]>(
    () => workerColumns,
    [fetchFinished.value]
  )

  const useData = () => {
    return data ? data : ([] as TData[])
  }

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0 pt-0'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Narudžbe
        </h1>

        <section className='mb-2 flex w-full items-center justify-center'>
          <div className='flex w-4/5 justify-end'>
            <Select
              value={fetchFinished}
              options={[
                { label: 'Zaključene', value: true },
                { label: 'Nezaključene', value: false },
              ]}
              onChange={(option) => option && setFetchFinished(option)}
            />
          </div>
        </section>

        <div className='relative flex w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <FinishOrderModal
        orderNote={order.note || ''}
        isOpen={openFinish}
        setIsOpen={setOpenFinish}
        order_id={order.id}
        setOrder={setOrder}
      />
      <DeleteOrderModal
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        order_id={order.id}
        setOrder={setOrder}
      />
    </>
  )
}

export default Orders
