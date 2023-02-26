import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useQuery } from '@tanstack/react-query'

import { debounce } from '../utils/debounce'
import { trpcClient } from '../utils/api'

import stringSimilarity from 'string-similarity'

interface GroupedStrings {
  [key: string]: string[]
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

    debounce(trigger, 300)
  }, [name, refetch])

  const handleSelectQuery = async (name: string) => {
    setName('')
    await router.push(`/articles/article_name/${name}`)
  }

  const similarityThreshold = 0.7

  const strings = articleData?.articles?.map((article) => article.name) || []

  const groups: GroupedStrings = strings.reduce(
    (result: GroupedStrings, string: string) => {
      // Check if the current string is similar to any existing group
      const similarGroup = Object.keys(result).find((key: string) => {
        const similarity = stringSimilarity.compareTwoStrings(key, string)
        return similarity > similarityThreshold
      })

      // If the current string is similar to an existing group, add it to that group
      if (similarGroup) {
        result[similarGroup]?.push(string)
      } else {
        // Otherwise, create a new group for the current string
        result[string] = [string]
      }

      return result
    },
    {}
  )

  // Get the minimum set of strings by taking the first string of each group
  const minimum = Object.values(groups).map((group: string[]) => group[0])

  return (
    <div className='relative flex h-12 w-full items-center justify-center bg-gray-300'>
      <input
        autoComplete='off'
        name='name'
        value={name || ''}
        onChange={(e) => setName(e.target.value)}
        className='text-md mx-10  w-full rounded-sm p-2 pl-10 outline-none'
      />
      {name && (
        <div className='absolute top-14 z-10 mx-10 flex max-h-[300px] w-full items-center justify-center overflow-y-auto bg-gray-300'>
          <ul className='h-full max-h-[300px] w-4/5 overflow-y-auto bg-white '>
            {minimum?.map((article_name) => (
              <ul
                onClick={() => handleSelectQuery(article_name || '')}
                className='m-b-[1px] h-8 cursor-pointer bg-gray-400 pl-4 hover:bg-gray-300'
                key={Math.random().toString()}
              >
                {article_name}
              </ul>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchBar
