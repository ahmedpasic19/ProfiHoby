import { Dialog } from '@headlessui/react'
import { AiFillCloseCircle } from 'react-icons/ai'

import ImageCarousel from '../../layout/ImageCarousel'

type TProps = {
  images: string[]
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const FullScreenImageModal = ({ isOpen, setIsOpen, images }: TProps) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className='fixed inset-0 z-[100]'>
        <div className='relative flex h-full w-full items-center justify-center bg-black'>
          <ImageCarousel images={images} />

          <AiFillCloseCircle
            onClick={() => {
              setIsOpen(false)
            }}
            className='absolute top-4 right-4 block h-8 w-8 cursor-pointer rounded-full bg-gray-600 hover:bg-gray-800'
          />
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

export default FullScreenImageModal
