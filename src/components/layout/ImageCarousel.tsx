import { useState } from 'react'
import Image from 'next/image'
import * as Bi from 'react-icons/bi'

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  function handlePrev() {
    setCurrentImageIndex(currentImageIndex - 1)
  }

  function handleNext() {
    setCurrentImageIndex(currentImageIndex + 1)
  }

  return (
    <div className='relative flex h-full w-full items-center justify-center p-10'>
      <div className='flex h-full w-full items-center justify-center'>
        <div className='relative flex h-full w-full items-center justify-center'>
          <button
            onClick={handlePrev}
            disabled={currentImageIndex === 0}
            className='absolute bottom-1/2 left-0 z-20 text-gray-800 disabled:text-gray-400'
          >
            <Bi.BiSkipPreviousCircle className='h-8 w-8' />
          </button>
          {/* eslint-disable */}
          <Image
            src={images[currentImageIndex]!}
            // width={400}
            // height={400}
            fill
            alt='article image'
            className='object-contain'
          />
          <button
            onClick={handleNext}
            disabled={currentImageIndex === images?.length - 1}
            className='absolute bottom-1/2 right-5 z-20 text-gray-800 disabled:text-gray-400'
          >
            <Bi.BiSkipNextCircle className='h-8 w-8' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCarousel
