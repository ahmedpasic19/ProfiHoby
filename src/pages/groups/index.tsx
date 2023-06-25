import { NextPage } from 'next'
import { useState, useMemo } from 'react'
import { trpcClient } from '../../utils/api'
import { useQuery } from '@tanstack/react-query'
import { Category, Group } from '@prisma/client'

import useProtectRoute from '../../hooks/useProtectRoute'

import CreateGroupModal from '../../components/modals/groups/CreateGroupModal'
import DeleteGroupModal from '../../components/modals/groups/DeleteGroupModal'
import UpdateGroupModal from '../../components/modals/groups/UpdateGroupModal'
import GroupArticlesModal from '../../components/modals/groups/GroupArticlesModal'
import SearchOLXCategoryModal from '../../components/modals/olx/SearchOLXCategoryModal'

import MainTable from '../../components/table/MainTable'
import { AiFillEdit } from 'react-icons/ai'
import { ImPriceTags } from 'react-icons/im'
import { FaTrash } from 'react-icons/fa'
import { BiCategoryAlt } from 'react-icons/bi'

const Groups: NextPage = () => {
  const [openArticles, setOpenArticles] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [openOLXCategory, setOpenOLXCategory] = useState(false)
  const [group, setGroup] = useState({} as Group & { category: Category })

  useProtectRoute()

  const { data: allGroups } = useQuery(['group.getAllGroups'], () =>
    trpcClient.group.getAllGroups.query()
  )

  // eslint-disable-next-line
  const columns = [
    { header: 'Naziv', accessorKey: 'name' },
    {
      header: 'Kategorija',
      accessorKey: 'category.name',
    },
    {
      header: 'OLX Kategorija',
      accessorKey: 'olx_category_id',
    },
    {
      header: 'Akcije',
      accessorKey: 'actions',
      cell: ({
        row,
      }: {
        row: { original: Group & { category: Category } }
      }) => {
        return (
          <div className='flex w-full justify-evenly'>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenArticles(true)
                setGroup(row.original)
              }}
            >
              <ImPriceTags className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenOLXCategory(true)
                setGroup(row.original)
              }}
            >
              <BiCategoryAlt className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenUpdate(true)
                setGroup(row.original)
              }}
            >
              <AiFillEdit className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setGroup(row.original)
              }}
            >
              <FaTrash className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
  ]

  const data = useMemo(() => allGroups || [], [allGroups])

  const useData = () => {
    return data ? data : []
  }

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Grupe
        </h1>

        <section className='flex w-4/5 items-center py-10'>
          <button
            onClick={() => setOpenCreate(true)}
            className='w-[250px] rounded-xl bg-blue-500 p-4 text-xl font-semibold text-white hover:bg-blue-600'
          >
            Dodaj grupu
          </button>
        </section>

        <div className='relative flex w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <CreateGroupModal isOpen={openCreate} setIsOpen={setOpenCreate} />
      <DeleteGroupModal
        group={group}
        setGroup={setGroup}
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
      />
      <UpdateGroupModal
        group={group}
        setGroup={setGroup}
        isOpen={openUpdate}
        setIsOpen={setOpenUpdate}
      />
      <GroupArticlesModal
        group={group}
        setGroup={setGroup}
        isOpen={openArticles}
        setIsOpen={setOpenArticles}
      />
      <SearchOLXCategoryModal
        group={group}
        setGroup={setGroup}
        isOpen={openOLXCategory}
        setIsOpen={setOpenOLXCategory}
      />
    </>
  )
}

export default Groups
