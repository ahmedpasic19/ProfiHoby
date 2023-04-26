import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { trpcClient } from '../utils/api'

const useProtectRoute = () => {
  const router = useRouter()
  const { data, status } = useSession()

  const { data: allWorkers } = useQuery(['workers.getAllWorkers'], () =>
    trpcClient.workers.getAllWorkers.query()
  )

  useEffect(() => {
    const navigate = async () => {
      await router.push('/')
    }

    // find if user is a worker
    const worker = allWorkers?.find(
      (worker) => worker.user.email === data?.user?.email
    )

    if (status === 'unauthenticated' || !worker) navigate().catch(console.error)
  }, [data, status, router, allWorkers])
}

export default useProtectRoute
