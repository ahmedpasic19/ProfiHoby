import { CategoriesOnArticle, Category } from '@prisma/client'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { api } from '../utils/api'

import Image from 'next/image'

type TArticleProps = {
  description: string
  title: string
  price: number
  url: string
  article_id: string
  categories: (CategoriesOnArticle & { category: Category })[]
}

const Home: NextPage = () => {
  const [category, setCategory] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const { data: articlesData, refetch } = api.article.getAllArticles.useQuery({
    pageIndex,
    pageSize: 50,
    category,
  })
  const { data: allCategories } = api.category.getAllCategories.useQuery()

  function createRandomArray(length: number) {
    const arr = []
    for (let i = 0; i < length; i++) {
      arr.push(i + 1) // generates a random number between 0 and 99
    }
    return arr
  }

  useEffect(() => {
    refetch()
  }, [pageIndex, refetch])

  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <div className='grid h-full min-h-screen w-full grid-cols-[350px_auto]'>
        <div className='flex w-full flex-col border-r-2 border-gray-600'>
          <h2 className='w-full py-5 text-center text-xl font-bold tracking-tighter'>
            Kategorije
          </h2>
          <ul className='flex h-full w-full flex-col'>
            {allCategories?.map((cat) => (
              <li
                className={`${
                  category === cat.name ? 'bg-gray-400' : 'bg-gray-300'
                } mb-[1px] h-8 w-full cursor-pointer pl-4 text-lg font-semibold hover:bg-gray-400`}
                onClick={() => {
                  if (category === cat.name) setCategory('')
                  else {
                    setCategory(cat.name)
                    setPageIndex(0)
                  }
                }}
                key={cat.id}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
        <div className='flex w-full items-center justify-center'>
          <div className='grid h-full w-full grid-cols-4 gap-5 px-10 pt-[25vh]'>
            {articlesData?.articles?.map((article) => (
              <Article
                key={article.id}
                title={article.name}
                description={article.description}
                url={article.image[0]?.url || ''}
                price={article.base_price}
                categories={article.categories}
                article_id={article.id}
              />
            ))}
          </div>
        </div>
        <div className='col-start-2 col-end-3 flex h-full w-full items-center justify-center py-5'>
          {createRandomArray(articlesData?.pageCount || 0).map((page) => (
            <button
              onClick={() => setPageIndex(page - 1)}
              key={Math.random().toString()}
              className={`${
                pageIndex === page - 1 ? 'bg-gray-800' : 'bg-gray-600 '
              } mx-1 flex h-5 w-5 items-center justify-center text-clip rounded-full p-5 text-xl font-bold text-white`}
            >
              <p>{page}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

const Article = ({
  description,
  title,
  price,
  url,
  categories,
  article_id,
}: TArticleProps) => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/articles/${article_id}`)}
      className='relative h-[320px] w-[250px] cursor-pointer rounded-lg border-2 bg-white drop-shadow-[3px_3px_2px] transition duration-100 hover:scale-105 hover:transform hover:drop-shadow-[7px_7px_4px]'
    >
      <section className='flex w-full items-center justify-center'>
        <Image
          src={url}
          alt='article image'
          width={250}
          height={150}
          className='rounded-xl rounded-b-none'
        />
      </section>
      <section className='mt-2 flex w-full flex-col p-2'>
        <h3 className='text-lg font-semibold tracking-tight text-gray-800'>
          {title}
        </h3>
        <p className='text-gray-400'>{description}</p>
        <div className='mt-2 grid grid-cols-2 grid-rows-2 gap-2'>
          {categories.map((category, i) => {
            if (i > 2) return
            return (
              <ArticleCategory
                key={Math.random().toString()}
                name={category.category.name}
              />
            )
          })}
        </div>
        <h2 className='absolute right-4 bottom-4 text-xl font-bold tracking-tighter text-gray-800'>
          {price}KM
        </h2>
      </section>
    </div>
  )
}

const ArticleCategory = ({ name }: { name: string }) => {
  return (
    <div className='h-6 w-[100px] truncate rounded-sm bg-gray-200 px-2 text-sm text-gray-800 drop-shadow-[0px_0px_1px]'>
      {name}
    </div>
  )
}
