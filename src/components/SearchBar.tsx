import { FormEvent, useState, useMemo } from 'react'
import { useRouter } from 'next/router'

import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import Image from 'next/image'
import SearchComponent from './SearchComponent'

type TListedArticleProps = {
  src: string
  article_name: string
  article_price: string | number
}

const SearchBar = () => {
  const [name, setName] = useState('')

  const router = useRouter()

  const { data: articleData, refetch } = useQuery(
    ['articles', { name, pageIndex: 0, pageSize: 100 }],
    () =>
      trpcClient.article.getAllArticles.query({
        name,
        pageIndex: 0,
        pageSize: 20,
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

  const articles = useMemo(() => articleData?.articles || [], [articleData])

  return (
    <div className='z-30 flex items-center border-b-2 border-gray-50'>
      <SearchComponent
        filter={name}
        filter_name='name'
        refetch={refetch}
        search={searchForArticle}
        handleChange={(e) => setName(e.target.value)}
      />
      {name && (
        <div className='absolute top-16 left-0 right-0 z-[9] flex w-full items-center justify-center overflow-y-auto bg-gray-300 px-2'>
          <ul className='h-full max-h-[20em] w-full overflow-y-auto'>
            {articles?.map((article) => (
              <li
                onClick={() => navigateToArticle(article?.id || '')}
                key={Math.random().toString()}
              >
                <ListedArticle
                  src={article?.image[0]?.access_url || ''}
                  article_name={article?.name || ''}
                  article_price={article?.base_price || ''}
                />
              </li>
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
    <article className='mb-1 flex h-[5em] cursor-pointer justify-evenly border-2 border-black/30  bg-gray-300 hover:bg-gray-400'>
      <div className='relative flex w-full items-center justify-center overflow-hidden'>
        <Image
          src={src}
          alt='article image'
          height={100}
          width={100}
          className='absolute object-contain'
        />
      </div>
      <div className='mx-5 flex h-full w-full items-center justify-center truncate break-words'>
        <h3 className='text-md w-full text-start font-medium uppercase text-gray-800'>
          {article_name}
        </h3>
      </div>
      <div className='flex h-full w-full items-center justify-center'>
        <h2 className='mr-2 w-full text-end text-xl font-semibold tracking-tighter'>
          {article_price}
          {' KM'}
        </h2>
      </div>
    </article>
  )
}
