import { NextPage } from 'next'
import { useState, useMemo } from 'react'
import { trpcClient } from '../../utils/api'
import { useQuery } from '@tanstack/react-query'

import useProtectRoute from '../../hooks/useProtectRoute'

import { Category, Group } from '@prisma/client'

import CreateCategoryModal from '../../components/modals/categories/CreateCategoryModal'
import UpdateCategoryModal from '../../components/modals/categories/UpdateCategoryModal'
import DeleteCategoryModal from '../../components/modals/categories/DeleteCategoryModal'
import CategoryGroupsModal from '../../components/modals/categories/CategoryGroupsModal'
import MainTable from '../../components/table/MainTable'

import { FaTrash } from 'react-icons/fa'
import { AiFillEdit } from 'react-icons/ai'
import { BiCategoryAlt } from 'react-icons/bi'

type TCategory = Category & { groups: Group[] }

type TRow = {
  original: TCategory
}

const Categories: NextPage = () => {
  const [category, setCategory] = useState({} as TCategory)
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openGroups, setOpenGroups] = useState(false)

  useProtectRoute()

  const { data: allCategories } = useQuery(['category.getAllCategories'], () =>
    trpcClient.category.getAllCategories.query()
  )

  const data = useMemo(() => allCategories || [], [allCategories])

  const useData = () => {
    return data ? data : ([] as TCategory[])
  }

  const columns = [
    {
      header: 'Šifra',
      accessorKey: 'id',
    },
    {
      header: 'Naziv',
      accessorKey: 'name',
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
                setOpenUpdate(true)
                setCategory(row.original)
              }}
            >
              <AiFillEdit className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenGroups(true)
                setCategory(row.original)
              }}
            >
              <BiCategoryAlt className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setCategory(row.original)
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
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0 pt-0'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Kategorije
        </h1>

        <section className='flex w-4/5 items-center py-10'>
          <button
            onClick={() => setOpenCreate(true)}
            className='w-[250px] rounded-xl bg-blue-500 p-4 text-xl font-semibold text-white hover:bg-blue-600'
          >
            Dodaj kategoriju
          </button>
        </section>

        <div className='relative flex w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <CreateCategoryModal isOpen={openCreate} setIsOpen={setOpenCreate} />
      <UpdateCategoryModal
        setIsOpen={setOpenUpdate}
        setCategory={setCategory}
        isOpen={openUpdate}
        category={category}
      />
      <DeleteCategoryModal
        setIsOpen={setOpenDelete}
        setCategory={setCategory}
        isOpen={openDelete}
        category={category}
      />
      <CategoryGroupsModal
        isOpen={openGroups}
        category={category}
        setCategory={setCategory}
        setIsOpen={setOpenGroups}
      />
    </>
  )
}

export default Categories
