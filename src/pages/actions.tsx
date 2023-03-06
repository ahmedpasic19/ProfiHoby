import { NextPage } from 'next'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArticleAction } from '@prisma/client'
import { trpcClient } from '../utils/api'

import CreateActionModal from '../components/modals/actions/CreateActionModal'
import MainTable from '../components/table/MainTable'
import * as Fa from 'react-icons/fa'
import { ImPriceTags } from 'react-icons/im'
import ActionArticlesModal from '../components/modals/actions/ActionArticlesModal'

type TRow = {
  original: ArticleAction
}

const Actions: NextPage = () => {
  const [action, setAction] = useState({} as ArticleAction)
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openArticles, setOpenArticles] = useState(false)

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
      header: 'Optis',
      accessorKey: 'description',
    },
    {
      header: 'Popust',
      accessorKey: 'discount',
    },
    {
      header: 'Artikli',
      accessorKey: 'articles',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex w-full justify-evenly'>
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
      header: 'Akcije',
      accessorKey: 'actions',
      cell: ({ row }: { row: TRow }) => {
        return (
          <div className='flex w-full justify-evenly'>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setAction(row.original)
              }}
            >
              <Fa.FaTrash className='h-8 w-8' />
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
      <ActionArticlesModal isOpen={openArticles} setIsOpen={setOpenArticles} />
    </>
  )
}

export default Actions
