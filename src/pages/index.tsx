'use client'
import { NextPage } from 'next'
import React from 'react'
import { api } from '../utils/api'

type TArticleProps = {
  description: string
  title: string
  price: number
  image: string
}

const Home: NextPage = () => {
  const { data } = api.article.getAllArticles.useQuery()

  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <div className='grid h-full min-h-screen w-4/5 grid-cols-[350px_auto]'>
        <div className='h-full w-full bg-gray-600'></div>
        <div className='flex w-full items-center justify-center'>
          <div className='grid h-full w-full grid-cols-4 gap-5 bg-gray-800 px-10 pt-[25vh]'>
            {data?.map((article) => (
              <Article
                key={article.id}
                title={article.name}
                description={article.description}
                image={article.image[0]?.image || ''}
                price={article.base_price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

const Article = ({ description, title, price, image }: TArticleProps) => {
  return (
    <div className='max-h-[400px] max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800'>
      <div className='flex h-[250px] w-full items-center justify-center '>
        {/* eslint-disable-next-line */}
        <img src={image} />
      </div>
      <div className='p-5'>
        <a href='#'>
          <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {title}
          </h5>
        </a>
        <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
          {description}
        </p>
        <a
          href='#'
          className='inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          {price}KM
          <svg
            aria-hidden='true'
            className='ml-2 -mr-1 h-4 w-4'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
              clipRule='evenodd'
            ></path>
          </svg>
        </a>
      </div>
    </div>
  )
}
