import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'

import SecondLevelDropdown from './SecondLevelDropdown'
import { BiChevronLeft } from 'react-icons/bi'
import Link from 'next/link'

type TProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  wasOpen: boolean
  links: { href: string; label: string }[]
}

const DropdownMenu = ({ setIsOpen, isOpen, wasOpen, links }: TProps) => {
  const [openAdminLinks, setOpenAdminLinks] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)
  const { status, data } = useSession()

  const { data: allWorkers } = useQuery(['workers.getAllWorkers'], () =>
    trpcClient.workers.getAllWorkers.query()
  )

  const { data: allCategories } = useQuery(['category.getAllCategories'], () =>
    trpcClient.category.getAllCategories.query()
  )

  // find if user is a worker
  const worker = allWorkers?.find(
    (worker) => worker.user.email === data?.user?.email
  )

  // Links to categories
  const categoryLinks =
    allCategories?.map((category) => ({
      label: category?.name,
      href: '/categories/' + category?.id,
      moreLinks: category.groups?.map((group) => ({
        label: group.name,
        href: '/groups/' + group.id,
      })),
    })) || []

  return (
    <>
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-3/4 bg-white ${
          isOpen ? 'animate-slide-in' : wasOpen ? 'animate-slide-out' : 'hidden'
        }`}
      >
        <div className='text-gray-80 relative flex  w-full items-center justify-center py-3 text-center text-2xl font-bold'>
          <button
            onClick={() => setIsOpen(false)}
            className='absolute left-0 p-5 text-start text-lg font-bold text-gray-800'
          >
            <BiChevronLeft className='h-8 w-8 text-gray-800' />
          </button>
          <h1 className='w-full text-center'>Profihoby</h1>
        </div>

        {/* Homepage link */}
        <div className='w-full'>
          <div
            className='w-full p-5 text-lg font-semibold text-gray-800'
            onClick={() => setIsOpen(false)}
          >
            <Link href='/'>Početna stranica</Link>
          </div>
        </div>

        {/* Open categories dropdown */}
        <div className='w-full'>
          <div className='w-full p-5 text-lg font-semibold text-gray-800'>
            <button onClick={() => setOpenCategories(true)}>Kategorije</button>
          </div>
        </div>

        {/* Open admin links dropdown */}
        {worker && (
          <div className='w-full'>
            <div className='w-full p-5 text-lg font-semibold text-gray-800'>
              <button onClick={() => setOpenAdminLinks(true)}>Admin</button>
            </div>
          </div>
        )}

        {/* Links for category pages */}
        <SecondLevelDropdown
          setIsOpenMain={setIsOpen}
          setIsOpenSecond={setOpenCategories}
          isOpen={openCategories}
          links={categoryLinks}
          moreLinks
          wasOpen={wasOpen}
          title='Kategorije'
        />

        {/* Links for admin pages */}
        <SecondLevelDropdown
          setIsOpenMain={setIsOpen}
          setIsOpenSecond={setOpenAdminLinks}
          isOpen={openAdminLinks}
          links={links.filter((link) => link.href != '/')}
          wasOpen={wasOpen}
          title='Admin'
        />

        {/* Close and logout btns */}
        <div className='absolute bottom-0 flex w-full flex-col'>
          {status === 'authenticated' && (
            <button
              onClick={() => signOut()}
              className='m-2 w-full rounded-sm bg-gray-800 p-5 text-start text-lg font-semibold text-white'
            >
              Logout
            </button>
          )}
        </div>
      </div>
      {/* Blur element */}
    </>
  )
}

export default DropdownMenu
