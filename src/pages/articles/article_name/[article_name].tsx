import { useRouter } from 'next/router'
import { useState } from 'react'

import { trpcClient } from '../../../utils/api'
import { useQuery } from '@tanstack/react-query'

import Article from '../../../components/Article'

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

  function createRandomArray(length: number) {
    const arr = []
    for (let i = 0; i < length; i++) {
      arr.push(i + 1) // generates a random number between 0 and 99
    }
    return arr
  }

  return (
    <div>
      {/* Articles */}
      <div className='flex w-full items-center justify-center'>
        <div className='grid h-full w-full grid-cols-4 gap-5 px-10 pt-[25vh]'>
          {articles?.articles?.map((article) => (
            <Article
              key={article.id}
              title={article.name}
              description={article.description}
              url={article.image[0]?.url || ''}
              price={article.base_price}
              categories={article.categories}
              article_id={article.id}
            />
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className='col-start-2 col-end-3 flex h-full w-full items-center justify-center py-5'>
        {createRandomArray(articles?.pageCount || 0).map((page) => (
          <button
            onClick={() => setPageIndex(page - 1)}
            key={Math.random().toString()}
            className={`${
              pageIndex === page - 1 ? 'bg-gray-800' : 'bg-gray-600 '
            } mx-1 flex h-5 w-5 items-center justify-center text-clip rounded-full p-5 text-xl font-bold text-white`}
          >
            <p>{page}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ArticleNamePage
