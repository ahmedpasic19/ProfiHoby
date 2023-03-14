import { Group, Category } from '@prisma/client'
import { Dialog } from '@headlessui/react'
import GroupForm from '../../layout/forms/groups/GroupForm'

type TProps = {
  group: Group & { category: Category }
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setGroup: React.Dispatch<React.SetStateAction<Group & { category: Category }>>
}

const DeleteGroupModal = ({ group, isOpen, setIsOpen, setGroup }: TProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setGroup({} as Group & { category: Category })
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setGroup({} as Group & { category: Category })
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <GroupForm
            group={group}
            isDeleting
            setGroup={setGroup}
            setIsOpen={setIsOpen}
          />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteGroupModal
