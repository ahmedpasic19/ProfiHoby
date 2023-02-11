import { NextPage } from 'next'
import { useMemo, useState } from 'react'
import { api } from '../utils/api'

import { ColumnDef } from '@tanstack/react-table'
import { Article, CategoriesOnArticle, Image } from '@prisma/client'

import MainTable from '../components/table/MainTable'
import CreateArticleModal from '../components/modals/CreateArticleModal'

import articleColumns from '../data/articleColumns'

type TArticle = Article & {
  image: Image[]
  categories: CategoriesOnArticle[]
}

const Articles: NextPage = () => {
  const [openCreate, setOpenCreate] = useState(false)

  const { data: allArticles } = api.article.getAllArticles.useQuery()

  const data = useMemo(() => allArticles, [allArticles])

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

        <div className='w-full justify-center relative flex overflow-y-auto'>
          <MainTable data={useData()} columns={columns} showNavigation />
        </div>
      </div>
      <CreateArticleModal isOpen={openCreate} setIsOpen={setOpenCreate} />
    </>
  )
}

export default Articles
