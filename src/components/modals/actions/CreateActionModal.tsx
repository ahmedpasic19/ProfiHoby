import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { ArticleAction } from '@prisma/client'

import ActionForm from '../../layout/actions/ActionForm'
import ArticlesForActionForm from '../../layout/actions/ArticlesForActionForm'

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
          ) : (
            <ArticlesForActionForm
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

export default CreateActionModal
