import { useState } from 'react'

import { Dialog } from '@headlessui/react'
import ArticleForm from './ArticleForm'
import ArticleCategoryForm from './ArticleCategoryForm'
import ArticleGroupForm from './ArticleGroupForm'
import UploadArticleImageForm from './UploadArticleImageForm'
import MultiformPageStepper from '../../../MultiformPageStepper'

import { Article } from '@prisma/client'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setOpenAddArticle: React.Dispatch<React.SetStateAction<boolean>>
}

const ArticleMultiformModal = ({
  isOpen,
  setIsOpen,
  setOpenAddArticle,
}: TProps) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [articleData, setArticleData] = useState({} as Article)
  const [articleId, setArticleId] = useState<string | null>(null)

  const onClose = () => {
    setIsOpen(false)
    setPageIndex(0)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className='fixed inset-0'>
        <div className='absolute h-full w-full bg-black/30' onClick={onClose} />

        <div>
          <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
            <div className='z-10 flex h-[50em] w-1/2 flex-col items-center overflow-y-auto rounded-xl bg-white'>
              {/* Stepper */}
              <div className='w-full px-10'>
                <MultiformPageStepper
                  setPageIndex={setPageIndex}
                  pageIndex={pageIndex}
                  numberOfPages={4}
                />
              </div>
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
              ) : pageIndex === 2 ? (
                <ArticleGroupForm
                  setPageIndex={setPageIndex}
                  pageIndex={pageIndex}
                  articleId={articleId}
                />
              ) : (
                <UploadArticleImageForm
                  setOpenAddArticle={setOpenAddArticle}
                  setPageIndex={setPageIndex}
                  article_id={articleId}
                  action_id=''
                />
              )}
            </div>
          </main>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

export default ArticleMultiformModal
