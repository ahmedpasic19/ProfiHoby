import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import Spinner from '../../components/Spinner'
import ArticleCarouselContainer from '../../components/layout/articles/ArticleCarouselContainer'

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
          pageSize: 25,
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
    <div className='flex h-full w-full flex-col pt-[8vh]'>
      <h1 className='mb-10 w-full text-center text-[3em] font-bold text-gray-800'>
        {category?.name}
      </h1>
      <div className='flex flex-col gap-5 pb-20'>
        {isSuccess &&
          data.pages.map((page) =>
            page.category?.groups.map((group) => (
              <ArticleCarouselContainer
                key={Math.random()}
                group_name={group.name}
                group_id={group.id || ''}
                // @ts-ignore // "url" is provided to the Image in the api query
                articles={group.articles.map(({ article }) => article)}
              />
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
