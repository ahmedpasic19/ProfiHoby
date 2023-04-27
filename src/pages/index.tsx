import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import SidebarCategory from '../components/SidebarCategory'
import Article from '../components/Article'
import Spinner from '../components/Spinner'
import Image from 'next/image'

const Home: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      // This is correct queryKey to use.
      // This queryKey is the one invalidated whenever any article is updated.
      ['article.index.page'],
      ({ pageParam = 0 }) =>
        trpcClient.article.getAllArticlesForHomePage.query({
          pageSize: 10,
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
      <section className='relative grid h-[50vh] w-full grid-cols-[20%_80%] grid-rows-1 items-center justify-center border-b-4 border-r-gray-500'>
        {/* Categories */}
        <div className='flex h-full w-full flex-col border-r-2 border-gray-600'>
          <h2 className='w-full py-5 text-center text-xl font-bold tracking-tighter text-gray-800'>
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
        <div className='relative min-h-[50vh] w-4/5 overflow-x-auto'>
          {actions?.map((action) => (
            <div key={action.id}>
              <Image
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
                className='h-auto w-auto'
                src={action.image[0]?.url || ''}
                alt='Article action'
                priority
                fill
              />
            </div>
          ))}
        </div>
      </section>
      {/* Articles */}
      <div className='flex w-full flex-col items-center justify-center'>
        <div className='mt-[4em] h-full w-full flex-col p-2 pl-0'>
          {isSuccess &&
            data.pages.map((page) =>
              page.group_articles.map((group) => (
                <div
                  key={Math.random()}
                  className='mb-14 flex w-full flex-col overflow-x-auto bg-white py-4 drop-shadow-2xl'
                >
                  <label className='pl-10 pb-4 text-2xl font-bold tracking-tight'>
                    {group.name}
                  </label>
                  <ul className='flex gap-4 pl-10'>
                    {group.articles.map(({ article }) => (
                      <Article
                        key={Math.random()}
                        action={article.article_action_id ? true : false}
                        actionPercentage={article?.action?.discount}
                        name={article.name}
                        //@ts-ignore // Error: "url doesn't exits on image", but it does exits
                        imageURL={(article.image[0]?.url as string) || ''}
                        price={article.base_price}
                        categories={article.categories}
                        article_id={article.id}
                      />
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
    </div>
  )
}

export default Home
