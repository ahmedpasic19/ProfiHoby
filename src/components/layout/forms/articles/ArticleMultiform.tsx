import { useState } from 'react'

import { Dialog } from '@headlessui/react'
import ArticleForm from './ArticleForm'
import ArticleCategoryForm from './ArticleCategoryForm'
import ArticleGroupForm from './ArticleGroupForm'
import UploadArticleImageForm from './UploadArticleImageForm'
import MultiformPageStepper from '../../../mics/MultiformPageStepper'

import { Article } from '@prisma/client'
import { AiFillCloseCircle } from 'react-icons/ai'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setOpenAddArticle: React.Dispatch<React.SetStateAction<boolean>>
}

type TArticle = Article & {
  attributes: { title: string; text: string; id: string }[]
}

const ArticleMultiformModal = ({
  isOpen,
  setIsOpen,
  setOpenAddArticle,
}: TProps) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [articleData, setArticleData] = useState({} as TArticle)
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
          <main className='flex h-full min-h-screen w-full flex-col items-center justify-center sm:h-[80vh]'>
            <div className='relative z-10 flex h-full w-full flex-col items-center overflow-y-auto rounded-xl bg-white sm:h-[80vh] sm:max-w-screen-sm'>
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
                />
              )}{' '}
              <AiFillCloseCircle
                onClick={onClose}
                className='absolute top-4 right-4 block h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800 sm:hidden'
              />
            </div>
          </main>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

export default ArticleMultiformModal
