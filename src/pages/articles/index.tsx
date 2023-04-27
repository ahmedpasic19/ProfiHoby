import { NextPage } from 'next'
import { useMemo, useState } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { Article, CategoriesOnArticle, Image } from '@prisma/client'

import { trpcClient } from '../../utils/api'
import { useQuery } from '@tanstack/react-query'

import useProtectRoute from '../../hooks/useProtectRoute'

import MainTable from '../../components/table/MainTable'

import DeleteArticleModal from '../../components/modals/articles/DeleteArticleModal'
import UpdateArticleModal from '../../components/modals/articles/UpdateArticleModal'
import UpdateArticleCategoriesModal from '../../components/modals/articles/UpdateArticleCategoriesModal'
import UpdateArticleImagesModal from '../../components/modals/articles/UpdateArticleImagesModal'
import UpdateArticleGroupsModal from '../../components/modals/articles/UpdateArticleGroupsModal'
import ArticleMultiformModal from '../../components/layout/forms/articles/ArticleMultiform'

import { BiCategoryAlt } from 'react-icons/bi'
import { BsFillImageFill } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { AiFillEdit } from 'react-icons/ai'
import { HiOutlineRectangleGroup } from 'react-icons/hi2'

type TArticle = Article & {
  image: Image[]
  categories: CategoriesOnArticle[]
}

type TRow = {
  original: TArticle
}

const Articles: NextPage = () => {
  const [article, setArticle] = useState({} as TArticle)
  const [openDelete, setOpenDelete] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openUpdateCategories, setOpenUpdateCategories] = useState(false)
  const [openUpdateImages, setOpenUpdateImages] = useState(false)
  const [openUpdateGroups, setOpenUpdateGroups] = useState(false)
  const [openAddArticle, setOpenAddArticle] = useState(false)

  useProtectRoute()

  const { data: articleData } = useQuery(
    ['articles', { pageSize: 100, pageIndex: 0, name: '' }],
    () =>
      trpcClient.article.getAllArticles.query({
        name: '',
        pageIndex: 0,
        pageSize: 100,
      })
  )

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
                setOpenUpdateImages(true)
                setArticle(row.original)
              }}
            >
              <BsFillImageFill className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenUpdateCategories(true)
                setArticle(row.original)
              }}
            >
              <BiCategoryAlt className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenUpdateGroups(true)
                setArticle(row.original)
              }}
            >
              <HiOutlineRectangleGroup className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenUpdate(true)
                setArticle(row.original)
              }}
            >
              <AiFillEdit className='h-8 w-8' />
            </button>
            <button
              className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
              onClick={() => {
                setOpenDelete(true)
                setArticle(row.original)
              }}
            >
              <FaTrash className='h-8 w-8' />
            </button>
          </div>
        )
      },
    },
  ]

  const data = useMemo(() => articleData?.articles || [], [articleData])

  // eslint-disable-next-line
  const columns = useMemo<ColumnDef<TArticle>[]>(() => articleColumns, [])

  const useData = () => {
    return data ? data : ([] as TArticle[])
  }

  return (
    <>
      <div className='flex h-full min-h-screen w-full flex-col items-center px-20 py-0 pt-0'>
        <h1 className='w-full text-center text-[3em] font-bold text-gray-800'>
          Artikli
        </h1>

        <section className='flex w-4/5 items-center py-10'>
          <button
            // onClick={() => router.push('/articles/create-article')}
            onClick={() => setOpenAddArticle(true)}
            className='w-[250px] rounded-xl bg-blue-500 p-4 text-xl font-semibold text-white hover:bg-blue-600'
          >
            Dodaj artikal
          </button>
        </section>

        <div className='relative flex w-full justify-center overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <ArticleMultiformModal
        isOpen={openAddArticle}
        setIsOpen={setOpenAddArticle}
        setOpenAddArticle={setOpenAddArticle}
      />
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
      <UpdateArticleImagesModal
        article={article}
        isOpen={openUpdateImages}
        setIsOpen={setOpenUpdateImages}
        setArticle={setArticle}
      />
      <UpdateArticleGroupsModal
        article={article}
        isOpen={openUpdateGroups}
        setIsOpen={setOpenUpdateGroups}
        setArticle={setArticle}
      />
    </>
  )
}

export default Articles
