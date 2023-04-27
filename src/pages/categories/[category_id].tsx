import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import Article from '../../components/Article'
import Spinner from '../../components/Spinner'

const CategoryArticles: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  const { category_id } = router.query

  const categoryId = typeof category_id === 'string' ? category_id : ''

  const { data: category } = useQuery(['category', { id: categoryId }], () =>
    trpcClient.category.getCategory.query({ id: categoryId })
  )

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      [category_id],
      ({ pageParam = 0 }) =>
        trpcClient.category.getAllCategoryWithGroupsAndArticles.query({
          category_id: typeof category_id === 'string' ? category_id : '',
          pageIndex: pageParam as number,
          pageSize: 10,
        }),
      {
        getNextPageParam: (data) =>
          data.pageIndex === data.pageCount ? undefined : data.pageIndex + 1,
      }
    )

  // ref to the div at the bottom of the page
  const ref = useRef<HTMLDivElement>(null)

  // Check if div at the bottom of the page is in view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }
  }, [])

  // Fetch new data if the div in the bottom of the page is in view
  useEffect(() => {
    if (isVisible) {
      // execute the desired function here
      fetchNextPage().catch(console.error)
    }
  }, [isVisible, fetchNextPage])

  return (
    <div className='flex h-full w-full flex-col px-10 pt-[8vh]'>
      <h1 className='mb-10 w-full text-center text-[3em] font-bold text-gray-800'>
        {category?.name}
      </h1>
      <div className='flex flex-col gap-5 pb-20'>
        {isSuccess &&
          data.pages.map((page) =>
            page.category?.groups.map((group) => (
              <div
                key={Math.random()}
                className='mb-14 flex w-full flex-col overflow-x-auto bg-white py-4 drop-shadow-2xl'
              >
                <label className='pl-10 pb-4 text-2xl font-bold tracking-tight'>
                  {group.name}
                </label>
                <ul className='flex gap-4 px-5'>
                  {group.articles.map((article) => (
                    <li
                      key={Math.random()}
                      className='flex w-full items-center justify-center'
                    >
                      <Article
                        action={
                          article.article.article_action_id ? true : false
                        }
                        actionPercentage={article.article.action?.discount}
                        name={article.article.name}
                        categories={article.article.categories}
                        imageURL={
                          //@ts-ignore // Error: "url doesn't exits on image", but it does exits
                          (article.article.image[0]?.url as string) || ''
                        }
                        price={article.article.base_price}
                        article_id={article.article_id}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
      </div>

      {isFetchingNextPage && (
        <div className='flex w-full items-center justify-center text-center'>
          <Spinner />
          Učitavanje...
        </div>
      )}

      {/* Fetch more when this div is in view */}
      <div ref={ref} className='z-[100] text-transparent'>
        BOTTOM ELEMENT
      </div>
    </div>
  )
}

export default CategoryArticles
