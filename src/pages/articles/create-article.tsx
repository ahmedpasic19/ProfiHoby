import { Article } from '@prisma/client'
import { NextPage } from 'next'
import { useState } from 'react'

import ArticleCategoryForm from '../../components/layout/ArticleCategoryForm'
import ArticleForm from '../../components/layout/ArticleForm'
import UploadImageForm from '../../components/layout/UploadImageForm'

const CreateArticle: NextPage = () => {
  const [pageIndex, setPageIndex] = useState(0)
  const [articleData, setArticleData] = useState({} as Article)
  const [articleId, setArticleId] = useState<string | null>(null)
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
