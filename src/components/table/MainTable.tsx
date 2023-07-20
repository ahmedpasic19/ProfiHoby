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
    <div className='flex h-fit flex-col overflow-x-auto'>
      <div>
        <div className='relative flex w-full flex-col pb-4'>
          {showNavigation ? <Pagination table={table} /> : null}
          <div className='max-h-[450px] overflow-auto'>
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
                  <tr key={Math.random()} className='border-b" bg-white'>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className={`overflow-ellipsis whitespace-nowrap px-6 py-2 text-sm font-light text-gray-900 ${
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
    </div>
  )
}

export default MainTable
