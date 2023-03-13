import { Dialog } from '@headlessui/react'
import { Group } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'

import { AiFillCloseCircle } from 'react-icons/ai'
import React, { FormEvent } from 'react'
import FieldSet from '../../Fieldset'

type TProps = {
  group: Group
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setGroup: React.Dispatch<React.SetStateAction<Group>>
}

const DeleteGroupModal = ({ group, isOpen, setIsOpen, setGroup }: TProps) => {
  const queryClient = useQueryClient()

  const { mutate: deleteGroup } = useMutation(
    () => trpcClient.group.deleteGroup.mutate({ id: group.id }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['group.getAllGroups'])
      },
    }
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    deleteGroup()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setGroup({} as Group)
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setGroup({} as Group)
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <form onSubmit={handleSubmit}>
            <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
              Izbriši group
            </h1>
            <FieldSet
              type='text'
              label='Naziv'
              name='name'
              readOnly={true}
              value={group.name}
            />
            <section className='relative flex h-full w-full items-center justify-center'>
              <button
                onSubmit={handleSubmit}
                className='absolute bottom-44 w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              >
                Izbriši
              </button>
            </section>
            <AiFillCloseCircle
              onClick={() => {
                setIsOpen(false)
                setGroup({} as Group)
              }}
              className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
            />
          </form>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteGroupModal
