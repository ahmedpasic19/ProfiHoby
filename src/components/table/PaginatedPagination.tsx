{
  /* eslint-disable */
}
import { useEffect } from 'react'
import { Table } from '@tanstack/react-table'

import * as Bi from 'react-icons/bi'

interface ReactTableProps<T extends object> {
  table: Table<T>
  setPage: React.Dispatch<React.SetStateAction<number>>
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  pageCount: number
}

const PaginatedPagination = <T extends object>({
  table,
  setPage,
  setPageSize,
  pageCount,
}: ReactTableProps<T>) => {
  // Table pageIndex and pageSize values
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize

  // Set pageSize & pageIndex to state
  // Because data is fetchend by pageIndex & pageSize from state
  useEffect(() => {
    setPage(pageIndex)
    setPageSize(pageSize)
  }, [pageIndex, pageSize])

  return (
    <div className='sticky flex h-12 w-full min-w-[1400px] items-center justify-center gap-2 bg-gray-100'>
      <button
        className='min-w-[2.5rem] cursor-pointer rounded border bg-white p-1 text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-white'
        onClick={() => table.setPageIndex(0)}
        disabled={table.getState().pagination.pageIndex === 0}
      >
        <Bi.BiChevronsLeft className='h-8 w-8' />
      </button>
      <button
        className='min-w-[2.5rem] cursor-pointer rounded border bg-white p-1 text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-white'
        onClick={() => table.previousPage()}
        disabled={table.getState().pagination.pageIndex === 0}
      >
        <Bi.BiChevronLeft className='h-8 w-8' />
      </button>
      <button
        className='min-w-[2.5rem] cursor-pointer rounded border bg-white p-1 text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-white'
        onClick={() => table.nextPage()}
        disabled={table.getState().pagination.pageIndex === pageCount - 1}
      >
        <Bi.BiChevronRight className='h-8 w-8' />
      </button>
      <button
        className='min-w-[2.5rem] cursor-pointer rounded border bg-white p-1 text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-white'
        onClick={() => table.setPageIndex(pageCount - 1)}
        disabled={table.getState().pagination.pageIndex === pageCount - 1}
      >
        <Bi.BiChevronsRight className='h-8 w-8' />
      </button>
      <span className='flex cursor-pointer items-center gap-1 text-lg font-medium text-gray-800'>
        <div>Stranica</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} od {pageCount}
        </strong>
      </span>
      <span className='flex items-center gap-1 text-lg font-medium text-gray-800'>
        | Idi na stranicu:
        <input
          type='number'
          placeholder='Broj...'
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
          className='w-16 rounded border p-1 outline-none'
        />
      </span>
      <select
        className='text-lg font-medium text-gray-800'
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {/* change items per page in this array */}
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      <div className='h-4' />
    </div>
  )
}

export default PaginatedPagination
