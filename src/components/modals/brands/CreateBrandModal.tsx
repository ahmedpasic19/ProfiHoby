import { Dialog } from '@headlessui/react'

import BrandForm from '../../layout/forms/brands/BrandForm'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateBrandModal = ({ isOpen, setIsOpen }: TProps) => {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <Dialog.Panel className='fixed inset-0 flex items-center justify-center'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => setIsOpen(false)}
        />
        <BrandForm setIsOpen={setIsOpen} />
      </Dialog.Panel>
    </Dialog>
  )
}

export default CreateBrandModal
