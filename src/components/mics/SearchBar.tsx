import { useState, useRef, FormEvent } from 'react'
import { useRouter } from 'next/router'

import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import SearchComponent from './SearchComponent'

const SearchBar = () => {
  const [name, setName] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const { refetch } = useQuery(
    ['articles', { name, pageIndex: 0, pageSize: 100 }],
    () =>
      trpcClient.article.getAllArticles.query({
        name,
        pageIndex: 0,
        pageSize: 20,
      })
  )

  // Search for inputed name
  const searchForArticle = async (e: FormEvent) => {
    e.preventDefault()
    const encodedQuery = encodeURI(name)

    await router.push(`/search?q=${encodedQuery}`)
    inputRef.current?.blur()
  }

  return (
    <div className='z-30 flex items-center border-b-2 border-gray-50'>
      <SearchComponent
        inputRef={inputRef}
        filter={name}
        filter_name='name'
        refetch={refetch}
        search={searchForArticle}
        handleChange={(e) => setName(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
