import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { ArticleAction } from '@prisma/client'

import ActionForm from '../../layout/forms/actions/ActionForm'
import ArticlesForActionForm from '../../layout/forms/actions/ArticlesForActionForm'
import UploadImageForm from '../../layout/forms/articles/UploadImageForm'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateActionModal = ({ isOpen, setIsOpen }: TProps) => {
  const [action, setAction] = useState<ArticleAction>({} as ArticleAction)
  const [pageIndex, setPageIndex] = useState(0)

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setAction({} as ArticleAction)
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setAction({} as ArticleAction)
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          {pageIndex === 0 ? (
            <ActionForm
              action={action}
              setAction={setAction}
              setIsOpen={setIsOpen}
              setPageIndex={setPageIndex}
            />
          ) : pageIndex === 1 ? (
            <ArticlesForActionForm
              action={action}
              setAction={setAction}
              setIsOpen={setIsOpen}
              setPageIndex={setPageIndex}
            />
          ) : (
            <UploadImageForm
              action_id={action.id}
              article_id=''
              setPageIndex={setPageIndex}
            />
          )}
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default CreateActionModal
