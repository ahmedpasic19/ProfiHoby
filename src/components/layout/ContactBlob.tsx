import Image from 'next/image'
import { useEffect, useState } from 'react'
import useScrollDetector from '../../hooks/useScrollDetector'

import OLX_logo from '../../assets/olx_logo.png'
import VIBER_logo from '../../assets/viber_logo.png'
import { BiCopy } from 'react-icons/bi'
import { BsFillTelephoneInboundFill } from 'react-icons/bs'
import useCopyToClipboard from '../../hooks/useCopyToClipboard'

const ContactBlob = () => {
  const [open, setOpen] = useState(false)
  const show = useScrollDetector()

  // Close menu when scroll down
  useEffect(() => {
    if (!show && open) {
      setOpen(false)
    }
    // eslint-disable-next-line
  }, [show])

  // Copy link and number
  const handleCopyToClipboard = useCopyToClipboard()

  return (
    <>
      {open && (
        <div className='absolute inset-0' onClick={() => setOpen(false)} />
      )}
      <div
        className={`${
          show ? 'animate-pop-up' : 'animate-pop-out'
        } fixed left-10 bottom-10 w-14 cursor-pointer ${
          open ? 'animate-open-up' : 'animate-close'
        } overflow-hidden border-2 border-gray-200 bg-white py-2 drop-shadow-2xl`}
      >
        {/* Display list if menu is open */}
        <ul
          className={`flex h-full w-full flex-col justify-start gap-4 ${
            open ? 'animate-unhide' : 'animate-hide'
          }`}
        >
          <li
            onClick={() =>
              handleCopyToClipboard('https://olx.ba/shops/ProfiHoby/aktivni')
            }
            className='relative flex h-full w-full items-center justify-start rounded-full'
          >
            <Image
              alt='Image'
              src={OLX_logo}
              width={100}
              height={100}
              className='absolute h-full rounded-full object-contain'
            />
            <label className='absolute left-20 font-semibold'>ProfiHoby</label>
            <BiCopy className='absolute right-10 h-5 w-5' />
          </li>
          <li
            onClick={() => handleCopyToClipboard('+387 62 671 327')}
            className='relative flex h-full w-full items-center justify-start rounded-full'
          >
            <Image
              alt='Image'
              src={VIBER_logo}
              width={100}
              height={100}
              className='absolute h-full rounded-full object-contain'
            />
            <label className='absolute left-20 font-semibold'>
              +387 62 671 327
            </label>
            <BiCopy className='absolute right-10 h-5 w-5' />
          </li>
        </ul>
        {/* Display contact icon when the menu is closed */}
        <div
          onClick={() => setOpen(true)}
          className={`${
            open ? 'animate-hide' : 'animate-unhide'
          } absolute inset-0 z-10 flex h-full w-full items-center justify-center`}
        >
          <BsFillTelephoneInboundFill className='h-7 w-7 text-gray-800' />
        </div>
      </div>
    </>
  )
}

export default ContactBlob
