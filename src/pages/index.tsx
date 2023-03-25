import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { trpcClient } from '../utils/api'

import { debounce } from '../utils/debounce'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import Article from '../components/Article'
import PagePagination from '../components/layout/PagePagination'
import SidebarCategory from '../components/SidebarCategory'

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

  const { data: allCategories } = useQuery(['category.getAllCategories'], () =>
    trpcClient.category.getAllCategories.query()
  )

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
            {allCategories?.map((category) => (
              <SidebarCategory
                key={category.id}
                name={category.name}
                groups={category.groups}
              />
            ))}
          </ul>
        </div>
        <div className='flex w-full items-center justify-center'>
          <div className='grid h-full w-full grid-cols-4 gap-5 px-10 pt-[25vh]'>
            {articleData?.articles?.map((article) => (
              <Article
                key={article.id}
                action={article.article_action_id ? true : false}
                actionPercentage={article?.action?.discount}
                name={article.name}
                description={article.description}
                imageURL={article.image[0]?.url || ''}
                price={article.base_price}
                categories={article.categories}
                article_id={article.id}
              />
            ))}
          </div>
        </div>
        <PagePagination
          pageCount={articleData?.pageCount || 0}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      </div>
    </div>
  )
}

export default Home
