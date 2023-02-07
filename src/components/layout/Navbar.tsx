'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { signOut } from 'next-auth/react'

const Navbar = () => {
  const navlinks = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/articles',
      label: 'Artikli',
    },
  ]

  return (
    <nav className='fixed top-0 left-0 z-20 w-full border-b border-gray-200 bg-white px-2 py-2.5 dark:border-gray-600 dark:bg-gray-900 sm:px-4'>
      <div className='container mx-auto flex flex-wrap items-center justify-between'>
        <Link href='/' className='flex items-center'>
          <Image
            src='https://flowbite.com/docs/images/logo.svg'
            width={200}
            height={100}
            className='mr-3 h-6 sm:h-9'
            alt='Flowbite Logo'
          />
          <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
            TRG Mulabdić
          </span>
        </Link>
        <div className='flex md:order-2'>
          <button
            onClick={() => signOut()}
            type='button'
            className='mr-3 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mr-0'
          >
            Log out
          </button>
          <button
            data-collapse-toggle='navbar-sticky'
            type='button'
            className='inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden'
            aria-controls='navbar-sticky'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
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
        <div
          className='hidden w-full items-center justify-between md:order-1 md:flex md:w-auto'
          id='navbar-sticky'
        >
          <ul className='mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:text-sm md:font-medium md:dark:bg-gray-900'>
            {navlinks.map((link) => (
              <NavLink key={link.label} href={link.href} label={link.label} />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const router = useRouter()

  return (
    <li>
      <Link
        href={href}
        className={`block rounded bg-blue-700 py-2 pl-3 pr-4 md:bg-transparent md:p-0 ${
          router.pathname === href ? 'text-blue-700' : 'text-white'
        }`}
        aria-current={router.pathname === href}
      >
        {label}
      </Link>
    </li>
  )
}

export default Navbar
