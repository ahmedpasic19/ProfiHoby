import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const useProtectRoute = () => {
  const router = useRouter()
  const { data, status } = useSession()

  useEffect(() => {
    const navigate = async () => {
      await router.push('/')
    }
    const valid_email =
      data?.user?.email === 'trgovinamulabdic@gmail.com'
        ? true
        : data?.user?.email === 'palepusac19@gmail.com'
        ? true
        : false
    if (status === 'unauthenticated' || !valid_email)
      navigate().catch(console.error)
  }, [data, status, router])
}

export default useProtectRoute
