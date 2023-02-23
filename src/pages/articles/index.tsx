import { NextPage } from 'next'
import { useMemo, useState } from 'react'
import { api } from '../../utils/api'

import { ColumnDef } from '@tanstack/react-table'
import { Article, CategoriesOnArticle, Image } from '@prisma/client'

import MainTable from '../../components/table/MainTable'
import CreateArticleModal from '../../components/modals/articles/CreateArticleModal'
import DeleteArticleModal from '../../components/modals/articles/DeleteArticleModal'
import * as Bi from 'react-icons/bi'
import * as Bs from 'react-icons/bs'
import * as Fa from 'react-icons/fa'
import * as Ai from 'react-icons/ai'
import UpdateArticleModal from '../../components/modals/articles/UpdateArticleModal'
import UpdateArticleCategoriesModal from '../../components/modals/articles/UpdateArticleCategoriesModal'

type TArticle = Article & {
  image: Image[]
  categories: CategoriesOnArticle[]
}

type TRow = {
  original: TArticle
}

const Articles: NextPage = () => {
  const [article, setArticle] = useState({} as TArticle)
  const [openCreate, setOpenCreate] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openUpdateCategories, setOpenUpdateCategories] = useState(false)

  const { data: allArticles } = api.article.getAllArticles.useQuery()

  const articleColumns = [
    {
      header: 'Naziv',
      accessorKey: 'name',
    },
    {
      header: 'Cijena',
      accessorKey: 'base_price',
    },
    {
      header: 'Opis',
      accessorKey: 'description',
    },
    {
      header: 'Popust',
      accessorKey: 'discount',
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
                const categories = row.original.categories.map(
                  (cat) => cat.category_id
                )
                return categories
              }}
            >
              <Bs.BsFillImageFill className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenUpdateCategories(true)
                setArticle(row.original)
              }}
            >
              <Bi.BiCategoryAlt className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenUpdate(true)
                setArticle(row.original)
              }}
            >
              <Ai.AiFillEdit className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setArticle(row.original)
              }}
            >
              <Fa.FaTrash className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
  ]

  const data = useMemo(() => allArticles, [allArticles])

  // eslint-disable-next-line
  const columns = useMemo<ColumnDef<TArticle>[]>(() => articleColumns, [])

  const useData = () => {
    return data ? data : ([] as TArticle[])
  }

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0 pt-24'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Artikli
        </h1>

        <section className='flex w-4/5 items-center py-10'>
          <button
            onClick={() => setOpenCreate(true)}
            className='w-[250px] rounded-xl bg-blue-500 p-4 text-xl font-semibold text-white hover:bg-blue-600'
          >
            Dodaj artikal
          </button>
        </section>

        <div className='relative flex w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <CreateArticleModal isOpen={openCreate} setIsOpen={setOpenCreate} />
      <DeleteArticleModal
        article={article}
        isOpen={openDelete}
        setIsOpen={setOpenDelete}
        setArticle={setArticle}
      />
      <UpdateArticleModal
        article={article}
        isOpen={openUpdate}
        setIsOpen={setOpenUpdate}
        setArticle={setArticle}
      />
      <UpdateArticleCategoriesModal
        article={article}
        isOpen={openUpdateCategories}
        setIsOpen={setOpenUpdateCategories}
        setArticle={setArticle}
      />
    </>
  )
}

export default Articles