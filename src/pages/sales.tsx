import { NextPage } from 'next'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

import Article from '../components/Article'
import PagePagination from '../components/layout/PagePagination'

const Sales: NextPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const { data: articlesData } = useQuery(
    ['article.getAllArticlesWithActions', { pageIndex, pageSize: 100 }],
    () =>
      trpcClient.article.getAllArticlesWithActions.query({
        pageIndex,
        pageSize: 100,
      })
  )

  return (
    <div>
      <div className='flex w-full items-center justify-center'>
        <div className='grid h-full w-full grid-cols-4 gap-5 px-10 pt-[25vh]'>
          {articlesData?.articles?.map((article) => (
            <Article
              key={article.id}
              name={article.name}
              action={article.article_action_id ? true : false}
              actionPercentage={article?.action?.discount}
              description={article.description}
              imageURL={article.image[0]?.url || ''}
              price={article.base_price}
              categories={article.categories}
              article_id={article.id}
            />
          ))}
        </div>
      </div>
      <PagePagination
        pageCount={articlesData?.pageCount || 0}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
      />
    </div>
  )
}

export default Sales
