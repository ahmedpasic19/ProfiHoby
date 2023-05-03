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
    <div className='relative flex h-fit w-full flex-col items-center justify-center border-b-2 border-white bg-gray-800 pt-2'>
      <div className=' flex w-full items-center justify-center pb-2'>
        <label className='flex w-full items-center justify-start pl-4 text-lg font-semibold text-gray-200'>
          <Link
            href={`/categories/${id}`}
            className='underline underline-offset-4'
          >
            {name}
          </Link>
        </label>
        <button
          onClick={() => setOpenCategory((prev) => !prev)}
          className='mr-2 flex h-full w-fit items-center justify-center'
        >
          <AiFillCaretDown
            className={`h-5 w-5 ${
              openCategory ? 'rotate-0' : '-rotate-90'
            } text-gray-50`}
          />
        </button>
        {openCategory && (
          <ul
            className={`absolute top-10 z-10 flex w-full flex-col ${
              openCategory
                ? 'animate-slide-in-group'
                : 'animate-slide-out-group'
            }`}
          >
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className='text-md bg-gray-700 py-1 pl-5 text-gray-300 underline underline-offset-4 hover:bg-gray-400'
              >
                {group.name}
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SidebarCategory
