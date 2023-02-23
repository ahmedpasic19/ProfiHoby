{
  /* eslint-disable */
}
import { Table } from '@tanstack/react-table'

import * as Bi from 'react-icons/bi'

interface ReactTableProps<T extends object> {
  table: Table<T>
}

const Pagination = <T extends object>({ table }: ReactTableProps<T>) => {
  return (
    <div className='sticky flex h-12 w-full min-w-[1400px] items-center justify-center gap-2 bg-white'>
      <button
        className='min-w-[40px] cursor-pointer rounded border p-1'
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <Bi.BiChevronsLeft className='h-8 w-8 text-gray-800' />
      </button>
      <button
        className='min-w-[40px] cursor-pointer rounded border p-1'
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <Bi.BiChevronLeft className='h-8 w-8 text-gray-800' />
      </button>
      <button
        className='min-w-[40px] cursor-pointer rounded border p-1'
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <Bi.BiChevronRight className='h-8 w-8 text-gray-800' />
      </button>
      <button
        className='min-w-[40px] cursor-pointer rounded border p-1'
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <Bi.BiChevronsRight className='h-8 w-8 text-gray-800' />
      </button>
      <span className='flex cursor-pointer items-center gap-1 text-lg font-medium text-gray-800'>
        <div>Stranica</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} od {table.getPageCount()}
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

export default Pagination
