import { Dialog } from '@headlessui/react'
import GroupForm from '../../layout/forms/groups/GroupForm'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateGroupModal = ({ isOpen, setIsOpen }: TProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <GroupForm setIsOpen={setIsOpen} />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default CreateGroupModal
