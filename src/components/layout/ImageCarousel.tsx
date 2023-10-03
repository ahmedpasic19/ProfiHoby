import { useState } from 'react'
import * as Bi from 'react-icons/bi'

import FullScreenImageModal from '../modals/articles/FullScreenImageModal'
import UnoptimizedImage from '../mics/UnoptimizedImage'

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [openFullScreen, setOpenFullScreen] = useState(false)

  function handlePrev() {
    setCurrentImageIndex(currentImageIndex - 1)
  }

  function handleNext() {
    setCurrentImageIndex(currentImageIndex + 1)
  }

  return (
    <>
      <div className='relative flex h-full w-full items-center justify-center'>
        <div className='flex h-full w-full items-center justify-center'>
          <div className='relative flex h-full w-full items-center justify-center'>
            <button
              onClick={handlePrev}
              disabled={currentImageIndex === 0}
              className='absolute bottom-1/2 left-0 z-20 text-gray-400 disabled:text-gray-200'
            >
              <Bi.BiSkipPreviousCircle className='h-8 w-8' />
            </button>
            {/* eslint-disable */}
            <UnoptimizedImage
              onClick={() => setOpenFullScreen(true)}
              src={images[currentImageIndex]!}
              fill
              alt='article image'
              className='cursor-pointer object-contain'
            />
            <button
              onClick={handleNext}
              disabled={currentImageIndex === images?.length - 1}
              className='absolute bottom-1/2 right-5 z-20 text-gray-400 disabled:text-gray-200'
            >
              <Bi.BiSkipNextCircle className='h-8 w-8' />
            </button>
          </div>
        </div>
      </div>
      <FullScreenImageModal
        isOpen={openFullScreen}
        setIsOpen={setOpenFullScreen}
        images={images}
      />
    </>
  )
}

export default ImageCarousel
