import { NextPage } from 'next'
import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Brand } from '@prisma/client'

import { trpcClient } from '../../utils/api'
import { useQuery } from '@tanstack/react-query'

import useProtectRoute from '../../hooks/useProtectRoute'

import MainTable from '../../components/table/MainTable'

import { BiCategoryAlt } from 'react-icons/bi'
import { FaTrash } from 'react-icons/fa'
import { AiFillEdit } from 'react-icons/ai'

import CreateBrandModal from '../../components/modals/brands/CreateBrandModal'
import DeleteBrandModal from '../../components/modals/brands/DeleteBrandModal'
import UpdateBrandModal from '../../components/modals/brands/UpdateBrandModal'
import BrandArticlesModal from '../../components/modals/brands/BrandArticlesModal'

type TRow = {
  original: Brand
}

const Brands: NextPage = () => {
  const [brand, setBrand] = useState({} as Brand)
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openBrandArticles, setOpenBrandArticles] = useState(false)
  const [openAddBrand, setOpenAddBrand] = useState(false)

  useProtectRoute()

  const { data: brands } = useQuery(['brand.getAllBrands'], () =>
    trpcClient.brand.getAllBrands.query()
  )

  const brandColumns = [
    {
      header: 'Naziv',
      accessorKey: 'name',
    },
    {
      header: 'Grupa',
      accessorKey: 'group.name',
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
                setOpenBrandArticles(true)
                setBrand(row.original)
              }}
            >
              <BiCategoryAlt className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenUpdate(true)
                setBrand(row.original)
              }}
            >
              <AiFillEdit className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setBrand(row.original)
              }}
            >
              <FaTrash className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
  ]

  const data = useMemo(() => brands || [], [brands])

  // eslint-disable-next-line
  const columns = useMemo<ColumnDef<Brand>[]>(() => brandColumns, [])

  const useData = () => {
    return brands ? data : []
  }

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0 pt-0'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Brendovi
        </h1>

        <section className='flex w-4/5 items-center pt-10'>
          <button
            onClick={() => {
              setOpenAddBrand(true)
            }}
            className='w-[250px] rounded-xl bg-blue-500 p-4 text-xl font-semibold text-white hover:bg-blue-600'
          >
            Dodaj brend
          </button>
        </section>

        <div className='relative flex w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <CreateBrandModal isOpen={openAddBrand} setIsOpen={setOpenAddBrand} />
      <DeleteBrandModal
        brand={brand}
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        setBrand={setBrand}
      />
      <UpdateBrandModal
        brand={brand}
        isOpen={openUpdate}
        setIsOpen={setOpenUpdate}
        setBrand={setBrand}
      />
      <BrandArticlesModal
        brand={brand}
        isOpen={openBrandArticles}
        setIsOpen={setOpenBrandArticles}
        setBrand={setBrand}
      />
    </>
  )
}

export default Brands
