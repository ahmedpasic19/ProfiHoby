import { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import Article from '../components/mics/Article'
import Spinner from '../components/mics/Spinner'
import FilterSidebar from '../components/layout/FilterSidebar'

import Pixel from '../components/Pixel'

const Sales: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  const [priceFrom, setPriceFrom] = useState(0)
  const [priceTo, setPriceTo] = useState(0)
  const [brand, setBrand] = useState('')
  const [orderByPrice, setOrderByPrice] = useState('' as string)

  const {
    data,
    fetchNextPage,
    refetch,
    isSuccess,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['article.getAllArticlesWithActions'],
    ({ pageParam = 0 }) =>
      trpcClient.article.getAllArticlesWithActions.query({
        pageIndex: pageParam as number,
        pageSize: 12,
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
    <>
      <Pixel name='FACEBOOK_PIXEL_1' />

      <div className='pt-5'>
        <div className='flex w-full items-center justify-center'>
          <FilterSidebar
            orderByPrice={orderByPrice}
            isLoading={isLoading}
            brand={brand}
            priceFrom={priceFrom}
            priceTo={priceTo}
            setBrand={setBrand}
            setOrderByPrice={setOrderByPrice}
            setPriceFrom={setPriceFrom}
            setPriceTo={setPriceTo}
            refetch={refetch}
          />
          <div className='flex h-full w-full flex-col sm:flex-row'>
            {isSuccess &&
              data.pages.map((page) =>
                page.articles.map((article) => (
                  <Article
                    key={Math.random()}
                    article_id={article.id}
                    categories={article.categories}
                    imageURL={article.image[0]?.access_url || ''}
                    name={article.name}
                    price={article.base_price}
                    discountPercentage={article.discountPercentage || 0}
                    discountPrice={article.discountPrice || 0}
                    onDiscount={article.onDiscount || false}
                  />
                ))
              )}
          </div>
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
    </>
  )
}

export default Sales
