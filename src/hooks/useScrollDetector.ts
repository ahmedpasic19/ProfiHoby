import { useState, useEffect } from 'react'

function useScrollDetector() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    let prevScrollPos = window.pageYOffset

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset

      if (prevScrollPos < currentScrollPos) {
        setShow(false)
      } else {
        setShow(true)
        timeout && clearTimeout(timeout)
        timeout = setTimeout(() => setShow(true), 3000)
      }

      prevScrollPos = currentScrollPos
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return show
}

export default useScrollDetector
