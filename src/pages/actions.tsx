import { NextPage } from 'next'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import useProtectRoute from '../hooks/useProtectRoute'

import { ArticleAction } from '@prisma/client'

import ActionArticlesModal from '../components/modals/actions/ActionArticlesModal'
import CreateActionModal from '../components/modals/actions/CreateActionModal'
import UpdateActionModal from '../components/modals/actions/UpdateActionModal'
import DeleteActionModal from '../components/modals/actions/DeleteActionModal'

import MainTable from '../components/table/MainTable'
import { FaTrash } from 'react-icons/fa'
import { AiFillEdit } from 'react-icons/ai'
import { ImPriceTags } from 'react-icons/im'

type TRow = {
  original: ArticleAction
}

const Actions: NextPage = () => {
  const [action, setAction] = useState({} as ArticleAction)
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openArticles, setOpenArticles] = useState(false)

  useProtectRoute()

  const { data: allActions } = useQuery(
    ['article_action.getAllArticleActions'],
    () => trpcClient.article_action.getAllArticleActions.query()
  )

  const data = useMemo(() => allActions || [], [allActions])

  const useData = () => {
    return data ? data : ([] as ArticleAction[])
  }

  const columns = [
    {
      header: 'Naziv',
      accessorKey: 'title',
    },
    {
      header: 'Popust',
      accessorKey: 'discount',
    },
    {
      header: 'Optis',
      accessorKey: 'description',
    },
    {
      header: 'Izmjeni',
      accessorKey: 'edit',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex justify-evenly'>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenUpdate(true)
                setAction(row.original)
              }}
            >
              <AiFillEdit className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
    {
      header: 'Artikli',
      accessorKey: 'articles',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex justify-evenly'>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenArticles(true)
                setAction(row.original)
              }}
            >
              <ImPriceTags className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
    {
      header: 'Obriši',
      accessorKey: 'delete',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex justify-evenly'>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setAction(row.original)
              }}
            >
              <FaTrash className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0 pt-24'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Akcije
        </h1>

        <section className='flex w-4/5 items-center py-10'>
          <button
            onClick={() => setOpenCreate(true)}
            className='w-[250px] rounded-xl bg-blue-500 p-4 text-xl font-semibold text-white hover:bg-blue-600'
          >
            Dodaj Akciju
          </button>
        </section>

        <div className='relative flex w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <CreateActionModal isOpen={openCreate} setIsOpen={setOpenCreate} />
      <UpdateActionModal
        isOpen={openUpdate}
        action={action}
        setAction={setAction}
        setIsOpen={setOpenUpdate}
      />
      <DeleteActionModal
        isOpen={openDelete}
        action={action}
        setAction={setAction}
        setIsOpen={setOpenDelete}
      />
      <ActionArticlesModal
        isOpen={openArticles}
        setIsOpen={setOpenArticles}
        setAction={setAction}
        action={action}
      />
    </>
  )
}

export default Actions
