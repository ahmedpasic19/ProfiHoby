import { FormEvent } from 'react'
import { trpcClient } from '../../../utils/api'
import { Category, Group } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Dialog } from '@headlessui/react'
import FieldSet from '../../mics/Fieldset'
import * as Ai from 'react-icons/ai'

type TCategory = Category & { groups: Group[] }

type TProps = {
  category: TCategory
  isOpen: boolean
  setCategory: React.Dispatch<React.SetStateAction<TCategory>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteCategoryModal = ({
  isOpen,
  category,
  setIsOpen,
  setCategory,
}: TProps) => {
  const queryClient = useQueryClient()
  const { mutate: deleteCategory } = useMutation(
    (input: { id: string }) => trpcClient.category.deleteCategory.mutate(input),
    {
      onSuccess: async () => {
        setIsOpen(false)
        setCategory({} as TCategory)
        await queryClient.invalidateQueries(['category.getAllCategories'])
      },
    }
  )

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    deleteCategory({ id: category.id })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setCategory({} as TCategory)
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setCategory({} as TCategory)
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <form
            onSubmit={handleSubmit}
            className='relative h-[584px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
          >
            <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
              Izbriši kategoriju
            </h1>
            <FieldSet
              type='text'
              label='Naziv'
              name='name'
              readOnly={true}
              value={category.name}
            />
            <section className='relative flex h-full w-full items-center justify-center'>
              <button
                onSubmit={handleSubmit}
                className='absolute bottom-44 w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              >
                Izbriši
              </button>
            </section>
            <Ai.AiFillCloseCircle
              onClick={() => {
                setIsOpen(false)
                setCategory({} as TCategory)
              }}
              className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
            />
          </form>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteCategoryModal
