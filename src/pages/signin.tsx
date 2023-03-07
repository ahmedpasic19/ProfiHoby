import { FormEvent, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Signin = () => {
  const handleGoogleSignin = async (e: FormEvent) => {
    e.preventDefault()

    await signIn('google')
  }
  const handleGitHubSignin = async (e: FormEvent) => {
    e.preventDefault()

    await signIn('github')
  }

  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    const navigate = async () => {
      await router.push('/')
    }

    if (session.status === 'authenticated') navigate().catch(console.error)
  }, [session, router])

  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <form className='flex h-[580px] w-[450px] flex-col items-center  justify-start rounded-xl bg-white p-10'>
        <h3 className='w-full text-center text-[2.5em] font-extrabold tracking-tight text-gray-800'>
          Sign in
        </h3>
        <p className='mt-12 text-xl font-[600] tracking-tight'>
          Choose a sign-in method
        </p>
        <div className='mt-5 h-[1px] w-4/5 bg-gray-800' />
        <section className='mt-10 flex w-full flex-col items-center justify-center'>
          <button
            onClick={handleGoogleSignin}
            className=' w-4/5 rounded-xl bg-gray-100 p-4 px-16 text-center text-[1.1rem] font-bold text-gray-800 drop-shadow-[0px_0px_2px] hover:bg-gray-200'
          >
            Sign in with Google
          </button>
          <button
            onClick={handleGitHubSignin}
            className='mt-8 w-4/5 rounded-xl bg-gray-800 p-4 px-16 text-center text-[1.1rem] 
          font-bold text-gray-100 drop-shadow-[0px_0px_2px] hover:bg-gray-700'
          >
            Sign in with GitHub
          </button>
          <Link
            href='/signin/credentials'
            className='mt-8 w-4/5 rounded-xl bg-gray-600 p-4 px-16 text-center text-[1.1rem] font-bold text-gray-100 drop-shadow-[0px_0px_2px] hover:bg-gray-400'
          >
            Sign in with Email
          </Link>
        </section>
      </form>
    </div>
  )
}

export default Signin
