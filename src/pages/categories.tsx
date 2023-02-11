'use client'
import { NextPage } from 'next'
import { useState, useMemo } from 'react'
import { Category } from '@prisma/client'
import { api } from '../utils/api'

import CreateCategoryModal from '../components/modals/CreateCategoryModal'
import MainTable from '../components/table/MainTable'
import columns from '../data/categoryColumns'

const Categories: NextPage = () => {
  const [openCreate, setOpenCreate] = useState(false)

  const { data: allCategories } = api.category.getAllCategories.useQuery()

  const data = useMemo(() => allCategories, [allCategories])

  const useData = () => {
    return data ? data : ([] as Category[])
  }

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0 pt-24'>
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
    </>
  )
}

export default Categories
