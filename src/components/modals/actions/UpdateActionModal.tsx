import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { ArticleAction } from '@prisma/client'

import ActionForm from '../../layout/actions/ActionForm'
import ArticlesForActionForm from '../../layout/forms/actions/ArticlesForActionForm'

type TProps = {
  isOpen: boolean
  action: ArticleAction
  setAction: React.Dispatch<React.SetStateAction<ArticleAction>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateActionModal = ({
  action,
  isOpen,
  setIsOpen,
  setAction,
}: TProps) => {
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
              isEditing
              action={action}
              setAction={setAction}
              setIsOpen={setIsOpen}
              setPageIndex={setPageIndex}
            />
          ) : (
            <ArticlesForActionForm
              actionArticles
              action={action}
              setAction={setAction}
              setIsOpen={setIsOpen}
              setPageIndex={setPageIndex}
            />
          )}
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default UpdateActionModal
