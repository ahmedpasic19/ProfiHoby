import { Dialog } from '@headlessui/react'
import { Group, Category } from '@prisma/client'
import GroupForm from '../../layout/forms/groups/GroupForm'

type TProps = {
  group: Group & { category: Category }
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setGroup: React.Dispatch<React.SetStateAction<Group>>
}

const UpdateGroupModal = ({ group, isOpen, setIsOpen, setGroup }: TProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setGroup({} as Group)
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setGroup({} as Group)
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <GroupForm
            group={group}
            isEditing
            setGroup={setGroup}
            setIsOpen={setIsOpen}
          />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default UpdateGroupModal
