import { NextPage } from 'next'
import { useState, useMemo } from 'react'
import { trpcClient } from '../utils/api'
import { useQuery } from '@tanstack/react-query'
import { Category, Group } from '@prisma/client'

import DeleteGroupModal from '../components/modals/groups/DeleteGroupModal'
import UpdateGroupModal from '../components/modals/groups/UpdateGroupModal'

import GroupForm from '../components/layout/forms/groups/GroupForm'
import MainTable from '../components/table/MainTable'
import { AiFillEdit } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'

const Groups: NextPage = () => {
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [group, setGroup] = useState({} as Group)

  const { data: allGroups } = useQuery(['group.getAllGroups'], () =>
    trpcClient.group.getAllGroups.query()
  )

  // eslint-disable-next-line
  const columns = [
    { header: 'Naziv', accessorKey: 'name' },
    {
      header: 'Kategorija',
      accessorKey: 'category',
      cell: ({ row }: { row: { original: { category: Category } } }) => {
        return row.original.category.name
      },
    },
    {
      header: 'Akcije',
      accessorKey: 'actions',
      cell: ({ row }: { row: { original: Group } }) => {
        return (
          <div className='flex w-full justify-evenly'>
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
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-24'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Grupe
        </h1>
        <GroupForm />
        <div className='relative flex h-[60vh] w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
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
    </>
  )
}

export default Groups
