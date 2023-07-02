import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'

import { trpcClient } from '../../../utils/api'
import { useInfiniteQuery } from '@tanstack/react-query'

import Article from '../../../components/Article'
import Spinner from '../../../components/Spinner'
import FilterSidebar from '../../../components/layout/FilterSidebar'

const ArticleNamePage = () => {
  const [priceFrom, setPriceFrom] = useState(0)
  const [priceTo, setPriceTo] = useState(0)
  const [brand, setBrand] = useState('')

  const [isVisible, setIsVisible] = useState(false)

  const router = useRouter()
  const { article_name } = router.query

  const name = typeof article_name === 'string' ? article_name : ''

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    ['articles.getAllArticles'],
    ({ pageParam = 0 }) =>
      trpcClient.article.getAllArticles.query({
        name,
        pageSize: 12,
        pageIndex: pageParam as number,
      }),
    {
      getNextPageParam: (data) => {
        return data.pageIndex === data.pageCount
          ? undefined
          : data.pageIndex + 1
      },
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
    <div className='pt-5'>
      <div className='flex w-full items-center justify-center'>
        <div className='flex h-full w-full flex-col sm:flex-row'>
          <FilterSidebar
            isLoading={isLoading}
            brand={brand}
            priceFrom={priceFrom}
            priceTo={priceTo}
            setBrand={setBrand}
            setPriceFrom={setPriceFrom}
            setPriceTo={setPriceTo}
            refetch={refetch}
          />
          <div className='article_grid_layout'>
            {isSuccess &&
              data?.pages?.map((page) =>
                page.articles.map((article) => (
                  <Article
                    key={article.id}
                    name={article.name}
                    action={article.article_action_id ? true : false}
                    actionPercentage={article?.action?.discount}
                    imageURL={article.image[0]?.access_url || ''}
                    price={article.base_price}
                    categories={article.categories}
                    article_id={article.id}
                  />
                ))
              )}
          </div>
        </div>
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

export default ArticleNamePage
