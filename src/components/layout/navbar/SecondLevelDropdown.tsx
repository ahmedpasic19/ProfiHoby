import { FC, useState } from 'react'
import Link from 'next/link'
import { BiChevronLeft } from 'react-icons/bi'

type TLink = {
  href: string
  label: string
  moreLinks?: { href: string; label: string }[]
}

type TProps = {
  setIsOpenMain: React.Dispatch<React.SetStateAction<boolean>>
  setIsOpenSecond: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  wasOpen: boolean
  links: TLink[]
  title: string
  moreLinks?: TLink[] | boolean
}

const SecondLevelDropdown: FC<TProps> = ({
  title,
  isOpen,
  links,
  moreLinks,
  setIsOpenMain,
  setIsOpenSecond,
  wasOpen,
}) => {
  const [link, setLink] = useState({} as TLink)

  return (
    <>
      <ul
        className={`fixed top-0 right-0 z-[60] h-screen w-full bg-white ${
          isOpen ? 'animate-slide-in' : wasOpen ? 'animate-slide-out' : 'hidden'
        }`}
      >
        <div className='text-gray-80 relative flex  w-full items-center justify-center py-3 text-center text-2xl font-bold'>
          <button
            onClick={() => setIsOpenSecond(false)}
            className='absolute left-0 p-5 text-start text-lg font-bold text-gray-800'
          >
            <BiChevronLeft className='h-8 w-8 text-gray-800' />
          </button>
          <h1 className='w-full text-center'>{title}</h1>
        </div>

        <ul className='h-screen overflow-y-auto'>
          {links
            .filter((link) => link.href !== '/')
            .map((link) => (
              <li
                key={Math.random()}
                onClick={() => {
                  !moreLinks && setIsOpenMain(false)
                  !moreLinks && setIsOpenSecond(false)
                  moreLinks && setLink(link)
                }}
                className='w-full p-5 text-lg font-semibold text-gray-800'
              >
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
        </ul>
      </ul>
      {link.moreLinks?.length && (
        <SecondLevelDropdown
          setIsOpenMain={() => {
            setIsOpenMain(false)
            setIsOpenSecond(false)
          }}
          setIsOpenSecond={() => setLink({} as TLink)}
          isOpen={Object.keys(link).length ? true : false}
          links={link.moreLinks || []}
          moreLinks={false}
          wasOpen={wasOpen}
          title={link.label}
        />
      )}
    </>
  )
}

export default SecondLevelDropdown
