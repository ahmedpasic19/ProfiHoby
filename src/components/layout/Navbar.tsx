import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import useGrantUniqueToken from '../../hooks/useGrantUniqueToken'

import Logo1 from '../../assets/logo1.png'
import Logo2 from '../../assets/logo2.png'
import Image from 'next/image'
import Link from 'next/link'
import DropdownMenu from './navbar/DropdownMenu'
import SearchBar from '../mics/SearchBar'
import { AiFillHome, AiOutlineShoppingCart } from 'react-icons/ai'

const Navbar = () => {
  const [token, setToken] = useState('')
  const [openDropDown, setOpenDropDown] = useState(false)
  const [dropdownWasOpen, setDropdownWasOpen] = useState(false) // Check if dropdown was open to determin the correct css

  // Grant user a unique token
  useGrantUniqueToken()

  useEffect(() => {
    const uniqueToken = localStorage.getItem('token') || ''
    setToken(uniqueToken)
  }, [])

  const { data: allWorkers } = useQuery(['workers.getAllWorkers'], () =>
    trpcClient.workers.getAllWorkers.query()
  )
  const { data: myOrder } = useQuery(['order.getMyUnfinishedOrder'], () =>
    trpcClient.order.getMyUnfinishedOrder.query({
      token,
    })
  )

  const articleCount = useMemo(
    () => myOrder?.articles?.reduce((prev) => prev + 1, 0),
    [myOrder?.articles]
  )

  const { data, status } = useSession()

  // For admin/worker users
  const authenticated = [
    {
      href: '/',
      label: 'Početna stranica',
    },
    {
      href: '/articles',
      label: 'Artikli',
    },
    {
      href: '/categories',
      label: 'Kategorije',
    },
    {
      href: '/groups',
      label: 'Grupe',
    },
    {
      href: '/workers',
      label: 'Radnici',
    },
    {
      href: '/orders',
      label: 'Narudžbe',
    },
    {
      href: '/brands',
      label: 'Brendovi',
    },
    {
      href: '/sales',
      label: 'Sniženja',
    },
  ]

  // For non-admin/non-worker users
  const unauthenticated = [
    {
      href: '/',
      label: 'Početna stranica',
    },
    {
      href: '/sales',
      label: 'Sniženja',
    },
  ]

  // find if user is a worker
  const worker = allWorkers?.find(
    (worker) => worker.user.email === data?.user?.email
  )

  const navlinks =
    status === 'authenticated' && worker ? authenticated : unauthenticated

  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (openDropDown) {
      // Disable scrolling
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable scrolling
      document.body.style.overflow = 'auto'
    }
  }, [openDropDown])

  const { pathname } = useRouter()

  return (
    <>
      <nav
        className={`sticky top-0 left-0 ${
          pathname === '/' ||
          pathname.includes('articles/') ||
          pathname.includes('search') ||
          pathname.includes('cart') ||
          pathname.includes('categories/') ||
          pathname.includes('groups/') ||
          // pathname === '/groups' ||
          // pathname === '/categories' ||
          openDropDown
            ? 'z-30'
            : ''
        } w-full border-b border-gray-200 bg-white px-2 py-2.5 sm:px-4`}
      >
        <div className='mx-auto flex justify-between sm:justify-evenly'>
          <Link href='/' className='relative flex items-center justify-center'>
            <Image
              src={Logo2}
              width={75}
              height={75}
              className='block h-1/2 w-1/2 object-contain'
              alt='Profihoby Logo'
            />
            <Image
              src={Logo1}
              className='hidden h-1/3 w-full object-fill sm:block'
              alt='Profihoby Logo'
            />
            <h2 className='w-full text-center text-2xl font-bold tracking-tighter'>
              {/* Profihoby */}
            </h2>
          </Link>

          <SearchBar />

          <div className='flex md:order-2'>
            {/* Log out btn */}
            {status === 'authenticated' && (
              <button
                onClick={() => signOut()}
                type='button'
                className='hidden rounded-lg bg-gray-800 px-5 text-center text-sm font-medium text-white hover:bg-gray-700 md:block'
              >
                Log out
              </button>
            )}
            <button
              onClick={() => {
                setOpenDropDown(true)
                setDropdownWasOpen(true)
              }}
              data-collapse-toggle='navbar-sticky'
              type='button'
              className='inline-flex items-center rounded-lg p-2 text-sm text-gray-500 md:hidden'
              aria-controls='navbar-sticky'
              aria-expanded='false'
            >
              <svg
                className='h-6 w-6'
                aria-hidden='true'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </button>
          </div>
          {/* Link list */}
          <div
            className='hidden w-full items-center justify-between md:order-1 md:flex md:w-auto'
            id='navbar-sticky'
          >
            <ul className='flex flex-col rounded-lg border border-gray-100 p-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:text-sm md:font-medium'>
              {navlinks.map((link) =>
                link.label === 'Početna stranica' ? (
                  <Link key={link.label} href={link.href}>
                    <AiFillHome className='h-5 w-5' />
                  </Link>
                ) : (
                  <NavLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                  />
                )
              )}
            </ul>
            <Link href='/cart' className='relative'>
              <AiOutlineShoppingCart className='ml-1 h-8 w-8' />
              {articleCount ? (
                <p className='absolute top-[-0.5rem] right-[-0.7rem] h-6 w-6 rounded-full bg-red-600 text-center font-semibold text-white'>
                  {articleCount}
                </p>
              ) : null}
            </Link>
          </div>
        </div>
      </nav>
      {/* Dropdown */}
      <DropdownMenu
        articleCount={articleCount || 0}
        wasOpen={dropdownWasOpen}
        isOpen={openDropDown}
        setIsOpen={setOpenDropDown}
        links={navlinks}
      />
      {/* Blur element */}
      {openDropDown && (
        <div
          onClick={() => setOpenDropDown(false)}
          className='fixed top-0 left-0 z-40 h-screen w-full bg-black bg-opacity-30 backdrop-blur-sm backdrop-filter'
        />
      )}
    </>
  )
}

export default Navbar

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const router = useRouter()

  return (
    <li>
      <Link
        href={href}
        className={`text-normal block rounded bg-blue-700 py-2 pl-3 pr-4 md:bg-transparent md:p-0 ${
          router.pathname === href ? 'text-blue-700' : 'text-gray-800'
        }`}
        aria-current={router.pathname === href}
      >
        {label}
      </Link>
    </li>
  )
}
