import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import Article from '../../components/Article'
import Spinner from '../../components/Spinner'
import FilterSidebar from '../../components/layout/FilterSidebar'

const GroupArticles: NextPage = () => {
  const [priceFrom, setPriceFrom] = useState(0)
  const [priceTo, setPriceTo] = useState(0)
  const [brand, setBrand] = useState('')
  const [orderByPrice, setOrderByPrice] = useState('' as string)

  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  const { group_id } = router.query

  const groupId = typeof group_id === 'string' ? group_id : ''

  const { data: group } = useQuery(['group', { id: groupId }], () =>
    trpcClient.group.getGroup.query({ id: groupId })
  )

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    [group_id],
    ({ pageParam = 0 }) =>
      trpcClient.article.getArticlesByGroupID.query({
        group_id: typeof group_id === 'string' ? group_id : '',
        pageSize: 12,
        pageIndex: pageParam as number,
        brand_id: brand || '',
        priceFrom: priceFrom || 0,
        priceTo: priceTo || 0,
        orderByPrice: orderByPrice || '',
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
    <div className='flex h-full w-full flex-col'>
      <h1 className='mb-10 w-full text-center text-[3em] font-bold text-gray-800'>
        {group?.name}
      </h1>

      <div className='flex h-full w-full flex-col sm:flex-row'>
        <FilterSidebar
          orderByPrice={orderByPrice}
          group_id={group_id as string}
          isLoading={isLoading}
          brand={brand}
          priceFrom={priceFrom}
          priceTo={priceTo}
          setBrand={setBrand}
          setPriceFrom={setPriceFrom}
          setOrderByPrice={setOrderByPrice}
          setPriceTo={setPriceTo}
          refetch={refetch}
        />
        {/* Article list */}
        <div className='article_grid_layout'>
          {isSuccess &&
            data.pages.map((page) => {
              return page.group?.articles.map((article) => {
                return (
                  <li
                    key={Math.random()}
                    className='flex w-full items-center justify-center'
                  >
                    <Article
                      discountPercentage={
                        article.article.discountPercentage || 0
                      }
                      discountPrice={article.article.discountPrice || 0}
                      onDiscount={article.article.onDiscount || false}
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
