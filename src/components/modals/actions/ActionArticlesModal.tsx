import { Dialog } from '@headlessui/react'
import { ArticleAction } from '@prisma/client'
import ArticlesForActionForm from '../../layout/actions/ArticlesForActionForm'

type TProps = {
  action: ArticleAction
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAction: React.Dispatch<React.SetStateAction<ArticleAction>>
}

const ActionArticlesModal = ({
  action,
  isOpen,
  setIsOpen,
  setAction,
}: TProps) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
          }}
        />
        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <ArticlesForActionForm
            actionArticles={true}
            action={action}
            setIsOpen={setIsOpen}
            setAction={setAction}
          />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default ActionArticlesModal
