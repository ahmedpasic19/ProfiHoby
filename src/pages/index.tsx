import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { trpcClient } from '../utils/api'

import { debounce } from '../utils/debounce'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Article from '../components/Article'

const Home: NextPage = () => {
  const [category, setCategory] = useState('')
  const [pageIndex, setPageIndex] = useState(0)

  const queryClient = useQueryClient()

  const { data: articleData, refetch } = useQuery(
    ['articles', { category: '', name: '', pageIndex: 0, pageSize: 100 }],
    () =>
      trpcClient.article.getAllArticles.query({
        category,
        name: '',
        pageIndex: 0,
        pageSize: 100,
      })
  )

  const { data: allCategories } = useQuery(['categories'], () =>
    trpcClient.category.getAllCategories.query()
  )

  function createRandomArray(length: number) {
    const arr = []
    for (let i = 0; i < length; i++) {
      arr.push(i + 1) // generates a random number between 0 and 99
    }
    return arr
  }

  useEffect(() => {
    const trigger = async () => {
      await refetch()
      await queryClient.invalidateQueries([
        'articles',
        { category: '', name: '', pageIndex: 0, pageSize: 100 },
      ])
    }
    trigger().catch(console.error)
  }, [category, refetch, queryClient])

  useEffect(() => {
    const trigger = async () => {
      await refetch()
    }

    debounce(trigger, 300)
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
            {articleData?.articles?.map((article) => (
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
          {createRandomArray(articleData?.pageCount || 0).map((page) => (
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
