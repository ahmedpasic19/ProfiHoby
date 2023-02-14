import { useState } from 'react'
import { Dialog } from '@headlessui/react'

import ArticleForm from '../../layout/ArticleForm'
import UploadImageForm from '../../layout/UploadImageForm'
import ArticleCategoryForm from '../../layout/ArticleCategoryForm'
import { Article } from '@prisma/client'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateArticleModal = ({ isOpen, setIsOpen }: TProps) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [articleData, setArticleData] = useState({} as Article)
  const [articleId, setArticleId] = useState<string | null>(null)
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => setIsOpen(false)}
        />
        <Dialog.Title>Kreiraj artikal</Dialog.Title>

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          {pageIndex === 0 ? (
            <ArticleForm
              setIsOpen={setIsOpen}
              setArticleData={setArticleData}
              setPageIndex={setPageIndex}
              setArticleId={setArticleId}
              articleData={articleData}
              pageIndex={pageIndex}
            />
          ) : pageIndex === 1 ? (
            <ArticleCategoryForm
              setIsOpen={setIsOpen}
              setPageIndex={setPageIndex}
              pageIndex={pageIndex}
              articleId={articleId}
            />
          ) : (
            <UploadImageForm
              setIsOpen={setIsOpen}
              setArticleId={setArticleId}
              setPageIndex={setPageIndex}
              articleId={articleId}
              pageIndex={pageIndex}
            />
          )}
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default CreateArticleModal
