{
  /* eslint-disable */
}
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import Pagination from './Pagination'

interface ReactTableProps<T extends object> {
  data: T[]
  columns: ColumnDef<T>[]
  showNavigation?: boolean
}

const MainTable = <T extends object>({
  data,
  columns,
  showNavigation,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className='flex h-fit flex-col'>
      <div className='overflow-x-auto'>
        <div className='relative flex w-full flex-col items-center pb-4'>
          {showNavigation ? <Pagination table={table} /> : null}
          <div className='mt-10 max-h-[450px] overflow-auto'>
            <table className='w-full min-w-[1400px] text-center'>
              <thead className='sticky top-0 border-b bg-gray-50'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
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
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='border-b" bg-white'>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className='whitespace-nowrap px-6 py-4 text-sm font-light text-gray-900'
                        key={cell.id}
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
    </div>
  )
}

export default MainTable
