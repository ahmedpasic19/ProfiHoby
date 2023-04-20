import { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import Article from '../components/Article'
import Spinner from '../components/Spinner'

const Sales: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  const { data, fetchNextPage, isSuccess, isFetchingNextPage } =
    useInfiniteQuery(
      ['article.getAllArticlesWithActions'],
      ({ pageParam = 0 }) =>
        trpcClient.article.getAllArticlesWithActions.query({
          pageIndex: pageParam as number,
          pageSize: 3,
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
    <div className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
      <div className='grid h-full w-full grid-cols-4 gap-5 px-10 pt-[5vh]'>
        {isSuccess &&
          data.pages.map((page) =>
            page.articles.map((article) => (
              <Article
                key={Math.random()}
                article_id={article.id}
                categories={article.categories}
                imageURL={article.image[0]?.url || ''}
                name={article.name}
                price={article.base_price}
                action={article.article_action_id ? true : false}
                actionPercentage={article.action?.discount}
              />
            ))
          )}
      </div>

      {!data?.pages.length ||
        (!data.pages[0]?.articles?.length && (
          <div className='flex w-full items-center justify-center text-center'>
            Nema artikala
          </div>
        ))}
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

export default Sales
