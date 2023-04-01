import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { trpcClient } from '../utils/api'

import { useInfiniteQuery } from '@tanstack/react-query'

import Article from '../components/Article'
import SidebarCategory from '../components/SidebarCategory'
import { THopePageData } from '../types/index_data'
import Spinner from '../components/Spinner'
import Image from 'next/image'
import { TArticle } from '../types/article'

const Home: NextPage<THopePageData> = ({
  actions,
  categories,
  initial_article_data,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      // This is correct queryKey to use.
      // This queryKey is the one invalidated whenever any article is updated.
      ['article.index.page'],
      ({ pageParam = 1 }) =>
        trpcClient.article.getAllArticlesForHomePage.query({
          pageSize: 3,
          pageIndex: pageParam as number,
        }),
      {
        // Fetch next page based on prev response
        getNextPageParam: (data: (typeof initial_article_data)['pages']) => {
          return data.pageIndex === data.pageCount
            ? undefined
            : data.pageIndex + 1
        },
        //@ts-ignore
        initialData: initial_article_data,
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
      <section className='relative grid h-[50vh] w-full grid-cols-[20%_80%] grid-rows-1 items-center justify-center border-b-4 border-r-gray-500'>
        {/* Categories */}
        <div className='flex h-full w-full flex-col border-r-2 border-gray-600'>
          <h2 className='w-full py-5 text-center text-xl font-bold tracking-tighter'>
            Kategorije
          </h2>
          <ul className='flex h-full w-full flex-col'>
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
          {actions.map((action) => (
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
      <div className='flex w-full items-center justify-center'>
        <div className='mt-[4em] h-full w-full flex-col p-2 pl-0'>
          {isSuccess &&
            data.pages.map((page) =>
              page.group_articles.map((group) => (
                <div
                  key={Math.random()}
                  className='mb-14 flex w-full flex-col bg-white py-4 drop-shadow-2xl'
                >
                  <label className='pl-10 pb-4 text-2xl font-bold tracking-tight'>
                    {group.name}
                  </label>
                  <ul className='flex gap-4 pl-10'>
                    {group.articles.map(
                      ({ article }: { article: TArticle }) => {
                        return (
                          <Article
                            key={Math.random()}
                            action={article.article_action_id ? true : false}
                            actionPercentage={article?.action?.discount}
                            name={article.name}
                            description={article.description}
                            imageURL={article.image[0]?.url || ''}
                            price={article.base_price}
                            categories={article.categories}
                            article_id={article.id}
                          />
                        )
                      }
                      // (
                      //   <Article key={Math.random() } article_id={article.}/>
                      // )
                    )}
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

export async function getServerSideProps() {
  const actions = await trpcClient.article_action.getAllArticleActions.query()

  const categories = await trpcClient.category.getAllCategories.query()

  const group_articles =
    await trpcClient.article.getAllArticlesForHomePage.query({
      pageIndex: 0,
      pageSize: 3,
    })

  const initial_article_data = {
    pages: [
      {
        group_articles: group_articles.group_articles,
        pageIndex: group_articles.pageIndex,
        pageCount: group_articles.pageCount,
        pageSize: group_articles.pageSize,
      },
    ],
    pageParams: [null],
  }

  return {
    props: {
      initial_article_data: JSON.parse(JSON.stringify(initial_article_data)),
      actions: JSON.parse(JSON.stringify(actions)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  }
}
