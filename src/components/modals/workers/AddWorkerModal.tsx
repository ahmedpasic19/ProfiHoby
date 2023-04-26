import { Dialog } from '@headlessui/react'
import WorkerForm from '../../layout/forms/workers/WorkerForm'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddWorkerModal = ({ isOpen, setIsOpen }: TProps) => {
  const onClose = () => setIsOpen(false)

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className='fixed inset-0'>
        <div className='absolute h-full w-full bg-black/30' onClick={onClose} />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <WorkerForm setIsOpen={setIsOpen} />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default AddWorkerModal
