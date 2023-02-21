'use client'
import { CategoriesOnArticle, Category } from '@prisma/client'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { api } from '../utils/api'

type TArticleProps = {
  description: string
  title: string
  price: number
  url: string
  article_id: string
  categories: (CategoriesOnArticle & { category: Category })[]
}

const Home: NextPage = () => {
  const { data } = api.article.getAllArticles.useQuery()

  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <div className='grid h-full min-h-screen w-full grid-cols-[350px_auto]'>
        <div className='h-full w-full border-r-2 border-gray-600'></div>
        <div className='flex w-full items-center justify-center'>
          <div className='grid h-full w-full grid-cols-4 gap-5 px-10 pt-[25vh]'>
            {data?.map((article) => (
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
              <Category
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

const Category = ({ name }: { name: string }) => {
  return (
    <div className='h-6 w-[100px] truncate rounded-sm bg-gray-200 px-2 text-sm text-gray-800 drop-shadow-[0px_0px_1px]'>
      {name}
    </div>
  )
}
