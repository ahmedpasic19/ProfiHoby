import { Dialog } from '@headlessui/react'
import { Group, Category } from '@prisma/client'
import ArticlesForGroupForm from '../../layout/forms/groups/ArticlesForGroupForm'

type TProps = {
  group: Group & { category: Category }
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setGroup: React.Dispatch<React.SetStateAction<Group & { category: Category }>>
}

const GroupArticlesModal = ({ group, isOpen, setIsOpen, setGroup }: TProps) => {
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
          <ArticlesForGroupForm
            groupArticles={true}
            group={group}
            setIsOpen={setIsOpen}
            setGroup={setGroup}
          />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default GroupArticlesModal
