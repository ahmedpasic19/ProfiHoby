import Link from 'next/link'
import { FC } from 'react'

type TProps = {
  setIsOpenMain: React.Dispatch<React.SetStateAction<boolean>>
  setIsOpenSecond: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  wasOpen: boolean
  links: { href: string; label: string }[]
  title: string
}

const SecondLevelDropdown: FC<TProps> = ({
  title,
  isOpen,
  links,
  setIsOpenMain,
  setIsOpenSecond,
  wasOpen,
}) => {
  return (
    <ul
      className={`fixed top-0 right-0 z-[60] h-screen w-full overflow-y-auto bg-white ${
        isOpen ? 'animate-slide-in' : wasOpen ? 'animate-slide-out' : 'hidden'
      }`}
    >
      <h1 className='text-gray-80 w-full py-3 text-center text-2xl font-bold'>
        {title}
      </h1>
      {links
        .filter((link) => link.href !== '/')
        .map((link) => (
          <li
            key={Math.random()}
            onClick={() => {
              setIsOpenMain(false)
              setIsOpenSecond(false)
            }}
            className='w-full p-5 text-lg font-semibold text-gray-800'
          >
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}

      {/* Close btn in admin links */}
      <div className='absolute bottom-0 flex w-full flex-col'>
        <button
          onClick={() => setIsOpenSecond(false)}
          className='w-full bg-gray-50 p-5 text-start text-lg font-bold text-gray-800'
        >
          Zatvori
        </button>
      </div>
    </ul>
  )
}

export default SecondLevelDropdown
