import { Dialog } from '@headlessui/react'
import { ArticleAction } from '@prisma/client'

import ActionForm from '../../layout/forms/actions/ActionForm'

type TProps = {
  isOpen: boolean
  action: ArticleAction
  setAction: React.Dispatch<React.SetStateAction<ArticleAction>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteActionModal = ({
  action,
  isOpen,
  setIsOpen,
  setAction,
}: TProps) => {
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
          <ActionForm
            isDeleting
            action={action}
            setAction={setAction}
            setIsOpen={setIsOpen}
          />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteActionModal
