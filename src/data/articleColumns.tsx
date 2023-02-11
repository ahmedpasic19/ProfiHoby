import { Article, CategoriesOnArticle, Image } from '@prisma/client'
import * as Bi from 'react-icons/bi'
import * as Bs from 'react-icons/bs'
import * as Fa from 'react-icons/fa'
import * as Ai from 'react-icons/ai'

type TArticle = Article & {
  image: Image[]
  categories: CategoriesOnArticle[]
}

type TRow = {
  original: TArticle
}

const columns = [
  {
    header: 'Naziv',
    accessorKey: 'name',
  },
  {
    header: 'Cijena',
    accessorKey: 'base_price',
  },
  {
    header: 'Opis',
    accessorKey: 'description',
  },
  {
    header: 'Popust',
    accessorKey: 'discount',
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
              const categories = row.original.categories.map(
                (cat) => cat.category_id
              )
              return categories
            }}
          >
            <Bs.BsFillImageFill className='h-8 w-8' />
          </button>
          <button
            className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
            onClick={() => {
              const categories = row.original.categories.map(
                (cat) => cat.category_id
              )
              return categories
            }}
          >
            <Bi.BiCategoryAlt className='h-8 w-8' />
          </button>
          <button
            className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
            onClick={() => {
              const categories = row.original.categories.map(
                (cat) => cat.category_id
              )
              return categories
            }}
          >
            <Ai.AiFillEdit className='h-8 w-8' />
          </button>
          <button
            className='rounded-lg bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600'
            onClick={() => {
              const categories = row.original.categories.map(
                (cat) => cat.category_id
              )
              return categories
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
