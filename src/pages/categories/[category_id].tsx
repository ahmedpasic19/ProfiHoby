import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'
import { TArticle } from '../../types/article'

import Article from '../../components/Article'
import Spinner from '../../components/Spinner'

type TProps = {
  initialData: {
    pages: {
      articles: TArticle[]
      pageIndex: number
      pageCount: number
      pageSize: number
    }
    pageParams: null[]
  }
}

const CategoryArticles: NextPage<TProps> = ({ initialData }) => {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  const { category_id } = router.query

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      [category_id],
      ({ pageParam = 1, queryKey }) => {
        const [category_id] = queryKey
        return trpcClient.article.getAllArticleByCategoryID.query({
          pageSize: 3,
          pageIndex: pageParam as number,
          category_id: typeof category_id === 'string' ? category_id : '',
          name: '',
        })
      },
      {
        // Fetch next page based on prev response
        getNextPageParam: (data: (typeof initialData)['pages']) =>
          data.pageIndex === data.pageCount ? undefined : data.pageIndex + 1,
        //@ts-ignore
        initialData,
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
    <div className='flex h-full w-full flex-col px-10 pt-[25vh]'>
      <div className='grid grid-cols-4 gap-5 pb-20'>
        {isSuccess &&
          data.pages.map((page) =>
            page.articles.map((article) => (
              <Article
                key={article.id}
                action={article.article_action_id ? true : false}
                actionPercentage={article?.action?.discount}
                name={article.name}
                description={article.description}
                imageURL={article.image[0]?.url || ''}
                price={article.base_price}
                categories={article.categories}
                article_id={article.id}
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
  )
}

export default CategoryArticles

export async function getServerSideProps(context: {
  params: { category_id: string }
}) {
  const category_id = context.params.category_id

  const res = await trpcClient.article.getAllArticleByCategoryID.query({
    category_id,
    pageIndex: 1,
    name: '',
    pageSize: 3,
  })

  // Date has to be serialized
  const modified_articles = res.articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    categories: article.categories.map((articleCategory) => ({
      ...articleCategory,
      assignedAt: articleCategory.assignedAt.toISOString(),
      category: {
        ...articleCategory.category,
        createdAt: articleCategory.category.createdAt.toISOString(),
        updatedAt: articleCategory.category.updatedAt.toISOString(),
      },
    })),
    action: article.action && {
      ...article.action,
      createdAt: article.action?.createdAt.toISOString(),
      updatedAt: article.action?.updatedAt.toISOString(),
    },
  }))

  const initialData = {
    pages: [
      {
        articles: modified_articles,
        pageIndex: res.pageIndex,
        pageCount: res.pageCount,
        pageSize: res.pageSize,
      },
    ],
    pageParams: [null],
  }

  return {
    props: {
      initialData,
    },
  }
}
