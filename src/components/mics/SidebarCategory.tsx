import { Group } from '@prisma/client'

import { AiFillCaretDown } from 'react-icons/ai'
import Link from 'next/link'

import * as Popover from '@radix-ui/react-popover'

interface TProps extends React.ComponentPropsWithoutRef<'li'> {
  id: string
  name: string
  groups: Group[]
}

const SidebarCategory = ({ id, name, groups }: TProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger className='flex w-full items-center justify-center py-2'>
        <label className='flex w-full items-center justify-start pl-4 font-semibold text-gray-800 lg:text-base xl:text-lg'>
          <Link
            href={`/categories/${id}`}
            className='underline underline-offset-4'
          >
            {name}
          </Link>
        </label>
        <button className='mr-2 flex h-full w-fit cursor-pointer items-center justify-center'>
          <AiFillCaretDown className={`h-5 w-5 -rotate-90 text-gray-800`} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className='PopoverContent' sideOffset={5}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className='text-md py-2 pl-5 text-gray-800 underline underline-offset-4 hover:bg-gray-100'
              >
                {group.name}
              </Link>
            ))}
          </div>
          <Popover.Arrow className='PopoverArrow' />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default SidebarCategory
