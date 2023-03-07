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
    if (
      status === 'unauthenticated' ||
      data?.user?.email !== 'palepusac19@gmail.com'
    )
      navigate().catch(console.error)
  }, [data, status, router])
}

export default useProtectRoute
