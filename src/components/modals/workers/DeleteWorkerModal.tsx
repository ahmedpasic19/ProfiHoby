import { Dialog } from '@headlessui/react'
import { User, Worker } from '@prisma/client'
import WorkerForm from '../../layout/forms/workers/WorkerForm'

type TProps = {
  worker: Worker & { user: User }
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setWorker: React.Dispatch<React.SetStateAction<Worker & { user: User }>>
}

const DeleteWorkerModal = ({
  worker,
  isOpen,
  setIsOpen,
  setWorker,
}: TProps) => {
  const onClose = () => {
    setIsOpen(false)
    setWorker({} as Worker & { user: User })
  }
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className='fixed inset-0'>
        <div className='absolute h-full w-full bg-black/30' onClick={onClose} />
        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <WorkerForm
            isDeleting
            worker={worker}
            setWorker={setWorker}
            setIsOpen={setIsOpen}
          />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteWorkerModal
