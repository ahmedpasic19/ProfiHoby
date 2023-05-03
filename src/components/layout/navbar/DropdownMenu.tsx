import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const DropdownMenu = ({
  setIsOpen,
  isOpen,
  links,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  links: { href: string; label: string }[]
}) => {
  const { status } = useSession()

  return (
    <div
      className={`fixed top-0 right-0 z-20 h-screen w-1/2 bg-white ${
        isOpen ? 'animate-slide-in' : 'animate-slide-out'
      }`}
    >
      <h2 className='w-full py-10 text-center text-2xl font-bold tracking-tighter'>
        Profihoby
      </h2>
      <ul className='w-full'>
        {links.map((link) => (
          <li
            key={Math.random()}
            onClick={() => setIsOpen(false)}
            className='w-full p-5 text-lg font-semibold text-gray-800'
          >
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <div className='absolute bottom-0 flex w-full flex-col'>
        <button
          onClick={() => setIsOpen(false)}
          className='w-full bg-gray-50 p-5 text-start text-lg font-semibold text-gray-800'
        >
          Close
        </button>

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
  )
}

export default DropdownMenu
