import { NextPage } from 'next'
import { useMemo, useState, useRef, FormEvent } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { Article, CategoriesOnArticle, Image } from '@prisma/client'

import { trpcClient } from '../../utils/api'
import { useQuery } from '@tanstack/react-query'

import useProtectRoute from '../../hooks/useProtectRoute'

import MainPaginatedTable from '../../components/table/MainPaginatedTable'

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
import { ImCancelCircle } from 'react-icons/im'

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

  const [pageSize, setPageSize] = useState(25)
  const [pageIndex, setPageIndex] = useState(0)
  const [inputName, setInputName] = useState('') // for input value
  const [name, setName] = useState('')

  const handleSearchArticle = (e: FormEvent) => {
    e.preventDefault()
    setName(ref.current?.value || '')
    setPageIndex(0)
  } // pass input value onClick

  const ref = useRef<HTMLInputElement>(null) // ref to article_name input

  const { data: articleData, isLoading } = useQuery(
    ['articles', { pageSize, pageIndex, name }],
    () =>
      trpcClient.article.getAllArticles.query({
        name,
        pageIndex,
        pageSize,
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

        <section className='flex w-4/5 items-center pt-10'>
          <button
            // onClick={() => router.push('/articles/create-article')}
            onClick={() => {
              setOpenAddArticle(true)
            }}
            className='w-[250px] rounded-xl bg-blue-500 p-4 text-xl font-semibold text-white hover:bg-blue-600'
          >
            Dodaj artikal
          </button>

          {/* Search articles */}
          <form
            onSubmit={handleSearchArticle}
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
                placeholder='Pretraži artikal'
                className='w-2/5 rounded-xl border-2 border-gray-800 p-3 outline-none'
              />
              {name && (
                <ImCancelCircle
                  onClick={() => {
                    setName('')
                    setInputName('')
                    setPageIndex(0) // reste pageIndex onClearSearch
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
          <MainPaginatedTable
            data={useData()}
            columns={columns}
            showNavigation
            setPage={setPageIndex}
            setPageSize={setPageSize}
            pageCount={articleData?.pageCount || 0}
            pageIndex={pageIndex}
          />
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
