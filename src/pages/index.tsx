import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import SidebarCategory from '../components/SidebarCategory'
import Spinner from '../components/Spinner'
import Image from 'next/image'
import ArticleCarouselContainer from '../components/layout/articles/ArticleCarouselContainer'

const Home: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      // This is correct queryKey to use.
      // This queryKey is the one invalidated whenever any article is updated.
      ['article.index.page'],
      ({ pageParam = 0 }) =>
        trpcClient.article.getAllArticlesForHomePage.query({
          pageSize: 25,
          pageIndex: pageParam as number,
        }),
      {
        // Fetch next page based on prev response
        getNextPageParam: (data) => {
          return data.pageIndex === data.pageCount
            ? undefined
            : data.pageIndex + 1
        },
        cacheTime: 0,
      }
    )

  const { data: categories } = useQuery(['category.getAllCategories'], () =>
    trpcClient.category.getAllCategories.query()
  )

  const { data: actions } = useQuery(
    ['article_action.getAllArticleActions'],
    () => trpcClient.article_action.getAllArticleActions.query()
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
      <section className='relative flex h-[50vh] w-full flex-col-reverse items-center justify-center border-b-4 border-r-gray-500 sm:grid sm:grid-cols-[minmax(20em,20%)_1fr] sm:grid-rows-1'>
        {/* Categories */}
        <div className='hidden h-full w-full flex-col border-r-2 border-gray-800/30 sm:flex'>
          <h2 className='w-full py-5 text-center text-2xl font-bold tracking-tighter text-gray-800 sm:text-xl'>
            Kategorije
          </h2>
          <ul className='flex h-full w-full flex-col overflow-y-auto'>
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
        {/* Action images */}
        <div className='relative flex min-h-[50vh] w-4/5 items-center justify-center overflow-x-auto'>
          {actions?.map((action) => (
            <div
              key={action.id}
              className='absolute flex items-center justify-center overflow-hidden'
            >
              <Image
                height={100}
                width={100}
                className='object-contain'
                src={action.image[0]?.url || ''}
                alt='Article action'
                priority
              />
            </div>
          ))}
        </div>
      </section>
      {/* Articles */}
      <div className='flex w-full flex-col items-center justify-center'>
        <div className='h-full w-full flex-col p-2 pl-0 sm:mt-[4em]'>
          {isSuccess &&
            data.pages.map((page) =>
              page.group_articles.map((group) => (
                <ArticleCarouselContainer
                  key={Math.random()}
                  group_name={group.name}
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
    </div>
  )
}

export default Home
