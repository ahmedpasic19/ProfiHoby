import { useState } from 'react'
import { Group } from '@prisma/client'

import { AiFillCaretDown } from 'react-icons/ai'
import Link from 'next/link'

interface TProps extends React.ComponentPropsWithoutRef<'li'> {
  id: string
  name: string
  groups: Group[]
}

const SidebarCategory = ({ id, name, groups }: TProps) => {
  const [openCategory, setOpenCategory] = useState(false)

  return (
    <div className='flex h-fit w-full flex-col items-center justify-center bg-gray-600 pt-2'>
      <div className='flex w-full items-center pb-2'>
        <label className='ml-5 w-full text-lg font-semibold text-gray-200'>
          <Link
            href={`/categories/${id}`}
            className='underline underline-offset-4'
          >
            {name}
          </Link>
        </label>
        <button
          onClick={() => setOpenCategory((prev) => !prev)}
          className='mb-[2px] mr-2 flex h-full items-center justify-center rounded-xl bg-gray-300 px-2 outline-none hover:bg-gray-400'
        >
          <AiFillCaretDown className='h-5 w-5 text-gray-50' />
        </button>
      </div>
      {openCategory && (
        <ul className='flex w-full flex-col'>
          {groups.map((group) => (
            <Link
              key={group.id}
              href='/group/:groupid'
              className='text-md bg-gray-500 py-1 pl-5 text-gray-300 underline underline-offset-4 hover:bg-gray-400'
            >
              {group.name}
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SidebarCategory
