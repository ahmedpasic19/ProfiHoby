import { useRouter } from 'next/router'
import { useState } from 'react'

import { trpcClient } from '../../../utils/api'
import { useQuery } from '@tanstack/react-query'

import Article from '../../../components/Article'
import PagePagination from '../../../components/layout/PagePagination'

const ArticleNamePage = () => {
  const [pageIndex, setPageIndex] = useState(0)

  const router = useRouter()
  const { article_name } = router.query

  const name = typeof article_name === 'string' ? article_name : ''

  const { data: articles } = useQuery(
    ['articles', { name: article_name }],
    () =>
      trpcClient.article.getAllArticles.query({
        name,
        category: '',
        pageSize: 100,
        pageIndex,
      })
  )

  return (
    <div>
      <div className='flex w-full items-center justify-center'>
        <div className='grid h-full w-full grid-cols-4 gap-5 px-10 pt-[25vh]'>
          {articles?.articles?.map((article) => (
            <Article
              key={article.id}
              name={article.name}
              action={article.article_action_id ? true : false}
              actionPercentage={article?.action?.discount}
              imageURL={article.image[0]?.url || ''}
              price={article.base_price}
              categories={article.categories}
              article_id={article.id}
            />
          ))}
        </div>
      </div>
      <PagePagination
        pageCount={articles?.pageCount || 0}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
      />
    </div>
  )
}

export default ArticleNamePage
