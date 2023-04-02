import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import Article from '../../components/Article'
import Spinner from '../../components/Spinner'
import {
  Article as ArticleModel,
  ArticleAction,
  ArticleGroups,
  CategoriesOnArticle,
  Category,
  Group,
  Image,
} from '@prisma/client'

type TProps = {
  initialData: {
    pages: {
      category:
        | (Category & {
            groups: (Group & {
              articles: (ArticleGroups & {
                article: ArticleModel & {
                  image: Image[]
                  categories: (CategoriesOnArticle & { category: Category })[]
                  action: ArticleAction | null
                }
              })[]
            })[]
          })
        | null
      pageIndex: number
      pageCount: number
      pageSize: number
    }[]
    pageParams: string[]
  }
}

const CategoryArticles: NextPage<TProps> = ({ initialData }) => {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  const { category_id } = router.query

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } =
    useInfiniteQuery(
      [category_id],
      ({ pageParam = 1 }) =>
        trpcClient.category.getAllCategoryWithGroupsAndArticles.query({
          category_id: typeof category_id === 'string' ? category_id : '',
          pageIndex: pageParam as number,
          pageSize: 3,
        }),
      {
        getNextPageParam: (data) =>
          data.pageIndex === data.pageCount ? undefined : data.pageIndex + 1,
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
    <div className='flex h-full w-full flex-col px-10 pt-[8vh]'>
      <div className='flex flex-col gap-5 pb-20'>
        {isSuccess &&
          data.pages.map((page) =>
            page.category?.groups.map((group) => (
              <div key={Math.random()} className='flex flex-col'>
                <label>{group.name}</label>
                <ul className='flex'>
                  {group.articles.map((article) => (
                    <Article
                      key={Math.random()}
                      action={article.article.article_action_id ? true : false}
                      actionPercentage={article.article.action?.discount}
                      name={article.article.name}
                      categories={article.article.categories}
                      //@ts-ignore // Error: "url doesn't exits on image", but it does exits
                      imageURL={(article.article.image[0]?.url as string) || ''}
                      price={article.article.base_price}
                      description={article.article.description}
                      article_id={article.article_id}
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
  )
}

export default CategoryArticles

export async function getServerSideProps(context: {
  params: { category_id: string }
}) {
  const category_id = context.params.category_id

  const res =
    await trpcClient.category.getAllCategoryWithGroupsAndArticles.query({
      category_id,
      pageIndex: 0,
      pageSize: 3,
    })

  const initialData = {
    pages: [
      {
        category: res.category,
        pageIndex: res.pageIndex,
        pageCount: res.pageCount,
        pageSize: res.pageSize,
      },
    ],
    pageParams: [category_id],
  }

  return {
    props: {
      initialData: JSON.parse(JSON.stringify(initialData)),
    },
  }
}
