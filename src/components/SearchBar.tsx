import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'

import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import Image from 'next/image'
import SearchComponent from './SearchComponent'

import useGroupSimularData from '../hooks/useGroupSimularData'

type TListedArticleProps = {
  src: string
  article_name: string
  article_price: string | number
}

const SearchBar = () => {
  const [name, setName] = useState('')

  const router = useRouter()

  const { data: articleData, refetch } = useQuery(
    ['articles', { category: '', name, pageIndex: 0, pageSize: 100 }],
    () =>
      trpcClient.article.getAllArticles.query({
        category: '',
        name: '',
        pageIndex: 0,
        pageSize: 100,
      })
  )

  // Navigate to the selected article
  const navigateToArticle = async (id: string) => {
    setName('')
    await router.push(`/articles/${id}`)
  }

  // Search for inputed name
  const searchForArticle = async (e: FormEvent) => {
    e.preventDefault()
    setName('')
    await router.push(`/articles/article_name/${name}`)
  }

  // Get the minimum set of article by taking the first string of each group
  const minimum = useGroupSimularData({
    groupBy: 'name',
    data: articleData?.articles || [],
    treshHold: 0.1,
  })

  return (
    <div className='relative flex w-full items-center bg-gray-300 py-2'>
      <SearchComponent
        filter={name}
        filter_name='name'
        refetch={refetch}
        search={searchForArticle}
        displayBtn
        handleChange={(e) => setName(e.target.value)}
      />
      {name && (
        <div className='absolute top-12 z-10 mx-10 flex max-h-[300px] w-full items-center justify-center overflow-y-auto bg-gray-300'>
          <ul className='h-full max-h-[300px] w-4/5 overflow-y-auto'>
            {minimum?.map((article) => (
              <ul
                onClick={() => navigateToArticle(article?.id || '')}
                key={Math.random().toString()}
              >
                <ListedArticle
                  src={article?.image[0]?.url || ''}
                  article_name={article?.name || ''}
                  article_price={article?.base_price || ''}
                />
              </ul>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchBar

const ListedArticle = ({
  src,
  article_name,
  article_price,
}: TListedArticleProps) => {
  return (
    <article className='mb-1 flex h-[100px] cursor-pointer  border-2 border-black  bg-gray-300 hover:bg-gray-400'>
      <Image src={src} alt='article image' height={100} width={100} />
      <div className='mx-10 flex h-full items-center justify-center'>
        <h3 className='text-xl font-semibold text-gray-800'>{article_name}</h3>
      </div>
      <div className='flex h-full w-full items-center justify-center'>
        <h2 className='text-2xl font-extrabold tracking-tight'>
          <b>{article_price}</b>
          {'  KM'}
        </h2>
      </div>
    </article>
  )
}
