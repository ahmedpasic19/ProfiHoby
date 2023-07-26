{
  /* eslint-disable */
}
import { useEffect } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import PaginatedPagination from './PaginatedPagination'

interface ReactTableProps<T extends object> {
  data: T[]
  columns: ColumnDef<T>[]
  showNavigation?: boolean
  setPage: React.Dispatch<React.SetStateAction<number>>
  setPageSize: React.Dispatch<React.SetStateAction<number>>
  pageCount: number
  pageIndex: number
}

const MainPaginatedTable = <T extends object>({
  data,
  columns,
  pageCount,
  showNavigation,
  setPage,
  setPageSize,
  pageIndex,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  })

  // If pageIndex state is reset then reset the table.pageIndex
  // This is done on handleSearchArticles for exp.
  useEffect(() => {
    table.setPageIndex(pageIndex)
  }, [pageIndex])

  // UPDATE table state.pageCount each time API returns new pageCount
  useEffect(() => {
    table.setPageCount(pageCount)
  }, [pageCount])

  return (
    <div className='flex h-fit flex-col items-center overflow-x-auto'>
      <div className='relative w-full'>
        {showNavigation ? (
          <PaginatedPagination
            table={table}
            setPage={setPage}
            setPageSize={setPageSize}
            pageCount={pageCount}
          />
        ) : null}
        <div className='max-h-[450px]'>
          <table className='w-full text-center'>
            <thead className='sticky top-0 border-b bg-gray-50'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={Math.random()}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={Math.random()}
                      className='px-6 py-4 text-lg font-medium text-gray-900'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr key={Math.random()} className='border-b bg-white'>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className={`max-w-[10rem] overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-2 text-sm font-light text-gray-900 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-200'
                      }`}
                      key={Math.random()}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MainPaginatedTable
