import { useState, FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../../utils/api'
import { Worker, User } from '@prisma/client'

import Select, { SingleValue } from 'react-select'
import { AiFillCloseCircle } from 'react-icons/ai'

type TWorker = Worker & { user: User }

type TProps = {
  worker?: TWorker
  isEditing?: boolean
  isDeleting?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setWorker?: React.Dispatch<React.SetStateAction<TWorker>>
}

type TUserOption = SingleValue<{ label: string; value: string }>

const WorkerForm = ({
  worker,
  isEditing,
  isDeleting,
  setIsOpen,
  setWorker,
}: TProps) => {
  const [user, setUser] = useState({} as TUserOption)

  const queryClient = useQueryClient()

  // Invalidate all queries
  const invalidateQueries = async () => {
    await queryClient.invalidateQueries(['workers.getAllWorkers'])
    await queryClient.invalidateQueries(['users.getAllUnEmployedUsers'])
  }

  const { data: allUnEmployedUsers } = useQuery(
    ['users.getAllUnEmployedUsers'],
    () => trpcClient.users.getAllUnEmployedUsers.query()
  )
  const { mutate: addWorker } = useMutation(
    (input: { user_id: string }) => trpcClient.workers.addWorker.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setUser({} as TUserOption)
        setIsOpen && setIsOpen(false)
      },
    }
  )
  const { mutate: updateWorker } = useMutation(
    (input: { worker_id: string; user_id: string }) =>
      trpcClient.workers.updateWorker.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setIsOpen && setIsOpen(false)
        setUser({} as TUserOption)
        setWorker && setWorker({} as TWorker)
      },
    }
  )
  const { mutate: deleteWorker } = useMutation(
    (input: { worker_id: string }) =>
      trpcClient.workers.deleteWorker.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setIsOpen && setIsOpen(false)
        setUser({} as TUserOption)
        setWorker && setWorker({} as TWorker)
      },
    }
  )

  const user_options =
    allUnEmployedUsers?.map((user) => ({
      value: user.id,
      label: user.name || '',
    })) || []

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (isDeleting && worker?.id) deleteWorker({ worker_id: worker.id })
    if (!user?.value) return console.log('here: ', user)

    if (!isEditing && !isDeleting) addWorker({ user_id: user.value })
    if (isEditing && worker?.id)
      updateWorker({ worker_id: worker.id, user_id: user.value })
  }

  // Current selected value
  const value = Object.keys(user ? user : {}).length
    ? user
      ? user
      : null
    : { label: worker?.user?.name || '', value: worker?.user?.id || '' }

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='relative flex w-[500px] flex-col items-center justify-center rounded-xl bg-white py-20'
      >
        <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
          {isEditing
            ? 'Izmjeni radnika'
            : isDeleting
            ? 'Izbriši radnika'
            : 'Dodaj radnika'}
        </h1>
        <div className='w-[80%]'>
          <label className='w-full pl-4 text-xl font-medium text-gray-800'>
            Odaberi korisnika
          </label>
          <Select
            isDisabled={isDeleting}
            options={user_options}
            value={value}
            placeholder='Odaberi korisnika'
            onChange={(option) => {
              if (option) setUser(option)
            }}
          />
        </div>
        <section className='mt-10 flex w-full items-center justify-center'>
          <button
            disabled={
              isDeleting ? false : !Object.keys(user ? user : {}).length
            }
            onSubmit={handleSubmit}
            className='w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
          >
            {isEditing ? 'Izmjeni' : isDeleting ? 'Izbriši' : 'Dodaj'}
          </button>
        </section>
        {isEditing && (
          <AiFillCloseCircle
            onClick={() => {
              setIsOpen && setIsOpen(false)
            }}
            className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
          />
        )}
      </form>
    </div>
  )
}

export default WorkerForm
