import { Category } from '@prisma/client'
import * as Fa from 'react-icons/fa'
import * as Ai from 'react-icons/ai'

type TRow = {
  original: Category
}

const columns = [
  {
    header: 'Šifra',
    accessorKey: 'id',
  },
  {
    header: 'Naziv',
    accessorKey: 'name',
  },
  {
    header: 'Opis',
    accessorKey: 'description',
  },
  {
    header: 'Akcije',
    accessorKey: 'actions',
    cell: ({ row }: { row: TRow }) => {
      return (
        <div className='flex w-full justify-evenly'>
          <button
            className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
            onClick={() => {
              return row.original.name
            }}
          >
            <Ai.AiFillEdit className='h-8 w-8' />
          </button>
          <button
            className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
            onClick={() => {
              return row.original.name
            }}
          >
            <Fa.FaTrash className='h-8 w-8' />
          </button>
        </div>
      )
    },
  },
]

export default columns
