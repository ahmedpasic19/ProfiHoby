import React from 'react'
import usePagePagination from '../../hooks/usePagePagination'

type TProps = {
  pageCount: number
  pageIndex: number
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
}

const PagePagination = ({ pageCount, pageIndex, setPageIndex }: TProps) => {
  const pagination = usePagePagination(pageCount)

  return (
    <div className='col-start-2 col-end-3 flex h-full w-full items-center justify-center py-5'>
      {pagination.map((page) => (
        <button
          onClick={() => setPageIndex(page - 1)}
          key={Math.random().toString()}
          className={`${
            pageIndex === page - 1 ? 'bg-gray-800' : 'bg-gray-600 '
          } mx-1 flex h-5 w-5 items-center justify-center text-clip rounded-full p-5 text-xl font-bold text-white`}
        >
          <p>{page}</p>
        </button>
      ))}
    </div>
  )
}

export default PagePagination
