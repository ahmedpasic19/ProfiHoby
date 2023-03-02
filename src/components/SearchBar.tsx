import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { debounce } from '../utils/debounce'

import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'
import { Article } from '@prisma/client'

import stringSimilarity from 'string-similarity'
import Image from 'next/image'
import * as Ai from 'react-icons/ai'

type TArticle = Article & {
  image: {
    url: string
    id: string
    name: string
    image: string
    article_id: string | null
    userId: string | null
  }[]
}

interface GroupedStrings {
  [key: string]: TArticle[]
}

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

  useEffect(() => {
    const trigger = async () => {
      await refetch()
    }

    debounce(trigger, 1000)
  }, [name, refetch])

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

  const similarityThreshold = 0.7

  const groups: GroupedStrings = (articleData?.articles || []).reduce(
    (result: GroupedStrings, article) => {
      // Check if the current article_name is similar to any existing group
      const similarGroup = Object.keys(result).find((key: string) => {
        const similarity = stringSimilarity.compareTwoStrings(key, article.name)
        return similarity > similarityThreshold
      })

      // If the current article is similar to an existing group, add it to that group
      if (similarGroup) {
        result[similarGroup]?.push(article)
      } else {
        // Otherwise, create a new group for the current article
        result[article.name] = [article]
      }

      return result
    },
    {}
  )

  // Get the minimum set of article by taking the first string of each group
  const minimum = Object.values(groups).map((group: TArticle[]) => group[0])

  return (
    <div className='relative flex w-full items-center bg-gray-300 py-2'>
      <form onSubmit={searchForArticle} className='flex'>
        <input
          autoComplete='off'
          placeholder='Pretraži artikle...'
          name='name'
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
          className='text-md mx-10 w-full min-w-[450px] rounded-sm p-2 pl-10 outline-none'
        />
        <button
          disabled={!name}
          onSubmit={searchForArticle}
          onClick={searchForArticle}
          className='flex items-center justify-center rounded-md bg-gray-800 px-3 text-lg font-bold tracking-wide text-white hover:bg-gray-700'
        >
          <Ai.AiOutlineSearch className='mr-4 h-6 w-6' /> <p>Pretraži</p>
        </button>
      </form>
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
