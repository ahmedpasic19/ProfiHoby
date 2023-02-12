import { FormEvent, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { api } from '../../../utils/api'
import FieldSet from '../../Fieldset'
import * as Ai from 'react-icons/ai'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCategoryModal = ({ isOpen, setIsOpen }: TProps) => {
  const [name, setName] = useState('')

  const utils = api.useContext()

  const { mutate } = api.category.createCategory.useMutation({
    onSuccess: async () => {
      setIsOpen(false)
      setName('')
      await utils.category.getAllCategories.invalidate()
    },
  })

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    mutate({ name })
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
        <Dialog.Title>Dodaj kategoriju</Dialog.Title>

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
