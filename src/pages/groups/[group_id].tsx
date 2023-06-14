import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import Article from '../../components/Article'
import Spinner from '../../components/Spinner'

const GroupArticles: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  const { group_id } = router.query

  const groupId = typeof group_id === 'string' ? group_id : ''

  const { data: group } = useQuery(['group', { id: groupId }], () =>
    trpcClient.group.getGroup.query({ id: groupId })
  )

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      [group_id],
      ({ pageParam = 0 }) =>
        trpcClient.article.getArticlesByGroupID.query({
          group_id: typeof group_id === 'string' ? group_id : '',
          pageSize: 25,
          pageIndex: pageParam as number,
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
        {group?.name}
      </h1>

      {/* Article list */}
      <div className='grid w-full grid-cols-2 gap-4 px-3 sm:grid-cols-3 md:gap-2 xl:grid-cols-4 2xl:grid-cols-6 2xl:gap-2 4k:grid-cols-10'>
        {isSuccess &&
          data.pages.map((page) => {
            return page.group?.articles.map((article) => {
              return (
                <li
                  key={Math.random()}
                  className='flex w-full items-center justify-center'
                >
                  <Article
                    action={article.article.article_action_id ? true : false}
                    actionPercentage={article.article.action?.discount}
                    categories={article.article.categories}
                    imageURL={
                      //@ts-ignore // Error: "url doesn't exits on image", but it does exits
                      (article.article.image[0]?.access_url as string) || ''
                    }
                    price={article.article.base_price}
                    article_id={article.article_id}
                    name={article.article.name}
                  />
                </li>
              )
            })
          })}
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

export default GroupArticles
