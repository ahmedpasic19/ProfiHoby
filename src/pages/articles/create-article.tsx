import { NextPage } from 'next'
import { useState } from 'react'

import useProtectRoute from '../../hooks/useProtectRoute'

import { Article } from '@prisma/client'

import ArticleCategoryForm from '../../components/layout/forms/articles/ArticleCategoryForm'
import ArticleForm from '../../components/layout/forms/articles/ArticleForm'
import UploadImageForm from '../../components/layout/forms/articles/UploadImageForm'

const CreateArticle: NextPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [articleData, setArticleData] = useState({} as Article)
  const [articleId, setArticleId] = useState<string | null>(null)

  useProtectRoute()

  return (
    <div>
      <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
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
          <UploadImageForm setPageIndex={setPageIndex} articleId={articleId} />
        )}
      </main>
    </div>
  )
}

export default CreateArticle
