import { FormEvent, useState } from 'react'
import { Dialog } from '@headlessui/react'
import FieldSet from '../../mics/Fieldset'
import * as Ai from 'react-icons/ai'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCategoryModal = ({ isOpen, setIsOpen }: TProps) => {
  const [name, setName] = useState('')

  const queryClient = useQueryClient()

  const { mutate: createCategory } = useMutation(
    (input: { name: string; groups: string[] }) =>
      trpcClient.category.createCategory.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['category.getAllCategories'])
        setIsOpen(false)
        setName('')
      },
    }
  )

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    createCategory({ name, groups: [] })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setName('')
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setName('')
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <form
            onSubmit={handleSubmit}
            className='relative h-[584px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
          >
            <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
              Dodaj kategoriju
            </h1>
            <FieldSet
              type='text'
              label='Naziv'
              name='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <section className='relative flex h-full w-full items-center justify-center'>
              <button
                disabled={!name}
                onSubmit={handleSubmit}
                className='absolute bottom-44 w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              >
                Dodaj
              </button>
            </section>
            <Ai.AiFillCloseCircle
              onClick={() => {
                setIsOpen(false)
                setName('')
              }}
              className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
            />
          </form>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default CreateCategoryModal
