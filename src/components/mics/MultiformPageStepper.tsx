import React from 'react'

type TProps = {
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  pageIndex: number
  numberOfPages: number
}

const MultiformPageStepper = ({
  pageIndex,
  setPageIndex,
  numberOfPages,
}: TProps) => {
  const pages = new Array(numberOfPages).fill('PAGE')

  return (
    <div className='flex w-full items-center justify-center py-4'>
      {pages.map((page, index) => {
        // First circle has no bars on the left or right
        if (index === 0) {
          return (
            <div key={Math.random()} className='flex items-center'>
              <span
                onClick={() => setPageIndex(index)}
                className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full p-5 text-lg font-semibold text-white ${
                  pageIndex === index
                    ? 'bg-gray-700'
                    : pageIndex > index
                    ? 'bg-gray-700'
                    : 'bg-gray-400'
                }`}
              >
                <p>{index + 1}</p>
              </span>
            </div>
          )
        }

        // Any other circle has a bar on the left
        if (index !== 0) {
          return (
            <div key={Math.random()} className='flex items-center'>
              <span
                className={`h-1 w-4 ${
                  pageIndex > index
                    ? 'bg-gray-600'
                    : pageIndex === index
                    ? 'bg-gray-600'
                    : 'bg-gray-400'
                }`}
              ></span>
              <span
                onClick={() => setPageIndex(index)}
                className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-full p-5 text-lg font-semibold text-white ${
                  pageIndex === index
                    ? 'bg-gray-700'
                    : pageIndex > index
                    ? 'bg-gray-700'
                    : 'bg-gray-400'
                }`}
              >
                <p>{index + 1}</p>
              </span>
            </div>
          )
        }
      })}
    </div>
  )
}

export default MultiformPageStepper
