import { NextPage } from 'next'
import { useState, useMemo, FormEvent, useRef } from 'react'
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
import { ImCancelCircle, ImPriceTags } from 'react-icons/im'
import { FaTrash } from 'react-icons/fa'
import { BiCategoryAlt } from 'react-icons/bi'

const Groups: NextPage = () => {
  const [openArticles, setOpenArticles] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [openOLXCategory, setOpenOLXCategory] = useState(false)
  const [group, setGroup] = useState({} as Group & { category: Category })

  const [name, setName] = useState('')
  const [inputName, setInputName] = useState('') // for input value

  const ref = useRef<HTMLInputElement>(null) // ref to article_name input

  useProtectRoute()

  const { data: allGroups, isLoading } = useQuery(
    ['group.getAllGroups', { name }],
    () => trpcClient.group.getAllGroups.query(name)
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
      header: 'Redni broj',
      accessorKey: 'order_key',
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

  const handleSearchGroups = (e: FormEvent) => {
    e.preventDefault()
    setName(ref.current?.value || '')
  } // pass input value onClick

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

          {/* Search articles */}
          <form
            onSubmit={handleSearchGroups}
            className='flex h-full w-full items-center justify-end pb-5'
          >
            <fieldset className='relative my-3 flex w-full flex-col items-end pr-5'>
              <input
                ref={ref}
                type='text'
                id='name'
                name='name'
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder='Pretraži grupe'
                className='w-2/5 rounded-xl border-2 border-gray-800 p-3 outline-none'
              />
              {name && (
                <ImCancelCircle
                  onClick={() => {
                    setName('')
                    setInputName('')
                  }}
                  className='absolute right-7 h-5 w-5 translate-y-[80%] cursor-pointer text-gray-600/30'
                />
              )}
            </fieldset>
            <button
              type='submit'
              className='rounded-xl bg-gray-800 p-3 text-center text-lg font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              disabled={isLoading}
            >
              {isLoading ? 'Učitavanje' : 'Pretraži'}
            </button>
          </form>
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
