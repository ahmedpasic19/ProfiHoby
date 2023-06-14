import { NextPage } from 'next'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'
import { User, Worker } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'

import MainTable from '../components/table/MainTable'

import AddWorkerModal from '../components/modals/workers/AddWorkerModal'
import DeleteWorkerModal from '../components/modals/workers/DeleteWorkerModal'

import { FaTrash } from 'react-icons/fa'

type TData = Worker & {
  user: User
}
type TRow = {
  original: TData
}

const Workers: NextPage = () => {
  const [openAddWorker, setOpenAddWorker] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [worker, setWorker] = useState({} as TData)

  const { data: allWorkers } = useQuery(['workers.getAllWorkers'], () =>
    trpcClient.workers.getAllWorkers.query()
  )

  const workerColumns = [
    {
      header: 'Naziv',
      accessorKey: 'user.name',
    },
    {
      header: 'Naziv',
      accessorKey: 'user.email',
    },
    {
      header: 'Objavljeno',
      accessorKey: 'articles',
    },
    {
      header: 'Akcije',
      accessorKey: 'actions',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex w-full justify-center'>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setWorker(row.original)
              }}
            >
              <FaTrash className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
  ]

  const data = useMemo(() => allWorkers || [], [allWorkers])

  // eslint-disable-next-line
  const columns = useMemo<ColumnDef<TData>[]>(() => workerColumns, [])

  const useData = () => {
    return data ? data : ([] as TData[])
  }

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0 pt-0'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Radnici
        </h1>

        <section className='flex w-4/5 items-center py-10'>
          <button
            // onClick={() => router.push('/articles/create-article')}
            onClick={() => setOpenAddWorker(true)}
            className='w-[250px] rounded-xl bg-blue-500 p-4 text-xl font-semibold text-white hover:bg-blue-600'
          >
            Dodaj radnika
          </button>
        </section>

        <div className='relative flex w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <AddWorkerModal isOpen={openAddWorker} setIsOpen={setOpenAddWorker} />
      <DeleteWorkerModal
        worker={worker}
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        setWorker={setWorker}
      />
    </>
  )
}

export default Workers
