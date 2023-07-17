import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import SidebarCategory from '../components/mics/SidebarCategory'
import Spinner from '../components/mics/Spinner'
import ArticleCarouselContainer from '../components/layout/articles/ArticleCarouselContainer'
import HighlightedArticles from '../components/layout/articles/HighlightedArticles'

const Home: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      // This is correct queryKey to use.
      // This queryKey is the one invalidated whenever any article is updated.
      ['article.getAllArticles'],
      ({ pageParam = 0 }) =>
        trpcClient.article.getAllArticlesForHomePage.query({
          pageSize: 12,
          pageIndex: pageParam as number,
        }),
      {
        // Fetch next page based on prev response
        getNextPageParam: (data) => {
          return data.pageIndex === data.pageCount
            ? undefined
            : data.pageIndex + 1
        },
      }
    )

  const { data: categories } = useQuery(['category.getAllCategories'], () =>
    trpcClient.category.getAllCategories.query()
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
      <section className='relative flex w-full flex-col items-center justify-center'>
        {/* Articles on sale or random low price articles */}
        <HighlightedArticles />

        {/* Categories */}
        <div className='hidden h-full w-full flex-col bg-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.25)] sm:flex'>
          <h2 className='w-full bg-white py-5 text-center text-2xl font-bold uppercase tracking-tighter text-main drop-shadow-[0px_1px_1px_rgba(0,0,0,0.25)]'>
            Kategorije
          </h2>
          <ul className='z-10 grid h-full w-full grid-cols-4 flex-col overflow-y-auto px-10'>
            {categories?.map((category) => (
              <SidebarCategory
                key={category.id}
                id={category.id}
                name={category.name}
                groups={category.groups}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Articles */}
      <div className='flex w-full flex-col items-center justify-center'>
        <div className='h-full w-full flex-col'>
          {isSuccess &&
            data.pages.map((page) =>
              page.group_articles.map((group) => (
                <ArticleCarouselContainer
                  key={Math.random()}
                  group_name={group.name}
                  group_id={group?.id || ''}
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
    </div>
  )
}

export default Home
