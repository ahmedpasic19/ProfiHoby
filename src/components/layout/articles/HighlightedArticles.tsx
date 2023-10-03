import { useState } from 'react'

import { StaticImageData } from 'next/image'
import Banner1 from '../../../assets/banner1.jpg'
import Banner2 from '../../../assets/banner2.jpg'
import UnoptimizedImage from '../../mics/UnoptimizedImage'

const HighlightedArticles = () => {
  const [itemIndex, setItemIndex] = useState(0)

  const handlePrevious = () => {
    if (itemIndex !== 0) setItemIndex((prev) => prev + 1)
  }
  const handleNext = () => {
    if (itemIndex !== -1) setItemIndex((prev) => prev - 1)
    else setItemIndex(0)
  }

  return (
    <div
      id='default-carousel'
      className='relative flex w-full overflow-hidden'
      data-carousel='slide'
    >
      <div className='relative flex h-56 overflow-hidden sm:w-full md:h-96'>
        {/* <HiglightedArticle url={Banner1} /> */}
        <ul
          className='flex items-center justify-center'
          style={{
            transform: `translateX(${itemIndex * 100}vw)`,
            transition: 'transform 0.5s ease-in',
          }}
        >
          <HiglightedArticle url={Banner1} />
          <HiglightedArticle url={Banner2} />
        </ul>
      </div>
      <div className='absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 space-x-3'>
        <button
          onClick={() => setItemIndex(0)}
          type='button'
          className={`h-3 w-3 rounded-full ${
            itemIndex === 0 ? 'bg-gray-600' : 'bg-gray-600/30'
          }`}
          aria-current='true'
          aria-label='Slide 1'
          data-carousel-slide-to='0'
        ></button>
        <button
          onClick={() => setItemIndex(-1)}
          type='button'
          className={`h-3 w-3 rounded-full ${
            itemIndex === -1 ? 'bg-gray-600' : 'bg-gray-600/30'
          }`}
          aria-current='false'
          aria-label='Slide 2'
          data-carousel-slide-to='1'
        ></button>
      </div>
      <button
        onClick={handlePrevious}
        type='button'
        className='group absolute top-0 left-0 z-20 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none'
        data-carousel-prev
      >
        <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-600/30 sm:h-10 sm:w-10'>
          <svg
            aria-hidden='true'
            className='h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M15 19l-7-7 7-7'
            ></path>
          </svg>
          <span className='sr-only'>Previous</span>
        </span>
      </button>
      <button
        onClick={handleNext}
        type='button'
        className='group absolute top-0 right-0 z-20 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none'
        data-carousel-next
      >
        <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-600/30 sm:h-10 sm:w-10'>
          <svg
            aria-hidden='true'
            className='h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 5l7 7-7 7'
            ></path>
          </svg>
          <span className='sr-only'>Next</span>
        </span>
      </button>
    </div>
  )
}

export default HighlightedArticles

const HiglightedArticle = ({ url }: { url: StaticImageData }) => {
  return (
    <div
      className='relative flex h-full w-screen items-center justify-center duration-700 ease-in-out'
      data-carousel-item
    >
      <UnoptimizedImage
        className='absolute block h-full w-full object-contain'
        alt='Article'
        src={url}
      />
    </div>
  )
}
