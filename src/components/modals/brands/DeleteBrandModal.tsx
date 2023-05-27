import { Dialog } from '@headlessui/react'
import BrandForm from '../../layout/forms/brands/BrandForm'

import { Brand } from '@prisma/client'

type TProps = {
  brand: Brand
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setBrand: React.Dispatch<React.SetStateAction<Brand>>
}

const DeleteBrandModal = ({ brand, isOpen, setIsOpen, setBrand }: TProps) => {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <Dialog.Panel className='fixed inset-0 flex items-center justify-center'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => setIsOpen(false)}
        />
        <BrandForm
          setIsOpen={setIsOpen}
          brand={brand}
          setBrand={setBrand}
          isDeleting
        />
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteBrandModal
