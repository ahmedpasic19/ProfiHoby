import { NextPage } from 'next'
import { useState } from 'react'
import { Article } from '@prisma/client'

import UploadImageForm from '../components/layout/UploadImageForm'
import ArticleForm from '../components/layout/ArticleForm'
import ArticleCategoryForm from '../components/layout/ArticleCategoryForm'

const AddArticlePage: NextPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [articleData, setArticleData] = useState({} as Article)
  const [articleId, setArticleId] = useState<string | null>(null)

  return (
    <main className='flex h-full min-h-screen w-full items-center justify-center'>
      {pageIndex === 0 ? (
        <ArticleForm
          setArticleData={setArticleData}
          setPageIndex={setPageIndex}
          setArticleId={setArticleId}
          articleData={articleData}
          pageIndex={pageIndex}
        />
      ) : pageIndex === 1 ? (
        <ArticleCategoryForm
          setPageIndex={setPageIndex}
          pageIndex={pageIndex}
          articleId={articleId}
        />
      ) : (
        <UploadImageForm
          setArticleId={setArticleId}
          setPageIndex={setPageIndex}
          articleId={articleId}
          pageIndex={pageIndex}
        />
      )}
    </main>
  )
}

export default AddArticlePage
