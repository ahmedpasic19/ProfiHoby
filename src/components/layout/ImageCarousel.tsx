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
    <div>
      <div className='relative'>
        <button
          onClick={handlePrev}
          disabled={currentImageIndex === 0}
          className='absolute bottom-1/2 left-5 text-gray-800 disabled:text-gray-400'
        >
          <Bi.BiSkipPreviousCircle className='h-8 w-8' />
        </button>
        <button
          onClick={handleNext}
          disabled={currentImageIndex === images?.length - 1}
          className='absolute bottom-1/2 right-5 text-gray-800 disabled:text-gray-400'
        >
          <Bi.BiSkipNextCircle className='h-8 w-8' />
        </button>
        {/* eslint-disable */}
        <Image
          src={images[currentImageIndex]!}
          width={800}
          height={800}
          alt='article image'
        />
      </div>
    </div>
  )
}

export default ImageCarousel
