import { useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect, useMemo } from 'react'

import { trpcClient } from '../utils/api'
import { useInfiniteQuery } from '@tanstack/react-query'

import Article from '../components/mics/Article'
import Spinner from '../components/mics/Spinner'
import FilterSidebar from '../components/layout/FilterSidebar'
import { NextPage } from 'next'

const SearchPage: NextPage = () => {
  const [priceFrom, setPriceFrom] = useState(0)
  const [priceTo, setPriceTo] = useState(0)
  const [brand, setBrand] = useState('')
  const [orderByPrice, setOrderByPrice] = useState('' as string)

  const [isVisible, setIsVisible] = useState(false)

  const search = useSearchParams()
  const name = useMemo(() => (search ? search.get('q') : null), [search])

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    name
      ? ['articles.getAllArticles', { name }]
      : ['articles.getAllArticles', { name: null }],
    ({ pageParam = 0 }) =>
      trpcClient.article.getAllArticles.query({
        name,
        pageSize: 12,
        pageIndex: pageParam as number,
        priceFrom: priceFrom || 0,
        priceTo: priceTo || 0,
        orderByPrice: orderByPrice || '',
      }),
    {
      getNextPageParam: (data) => {
        return data.pageIndex === data.pageCount
          ? undefined
          : data.pageIndex + 1
      },
    }
  )
  console.log(name)
  console.log(data)
  useEffect(() => {
    if (name) {
      refetch().catch(console.error)
    }
  }, [name, refetch])

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
          <div className='article_grid_layout'>
            {isSuccess &&
              data?.pages?.map((page) =>
                page.articles.map((article) => (
                  <Article
                    key={article.id}
                    name={article.name}
                    discountPercentage={article.discountPercentage || 0}
                    discountPrice={article.discountPrice || 0}
                    onDiscount={article.onDiscount || false}
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

      {isSuccess && data?.pages?.at(0)?.articles?.length === 0 ? (
        <div className='w-full text-center text-2xl font-bold text-gray-800'>
          Nema rezultata
        </div>
      ) : null}

      {isLoading && (
        <div className='flex w-full items-center justify-center text-center'>
          <Spinner />
          Učitavanje...
        </div>
      )}

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

export default SearchPage
