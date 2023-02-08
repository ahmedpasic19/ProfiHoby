import { FormEvent, useState } from 'react'
import FieldSet from '../components/Fieldset'
import { api } from '../utils/api'

const Index = () => {
  const [name, setName] = useState('')

  const { mutate } = api.category.createCategory.useMutation()

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    mutate({ name })
  }

  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <form onSubmit={handleSubmit}>
        <FieldSet
          type='text'
          label='Naziv grupe'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <section className='mt-10 flex w-full items-center justify-center'>
          <button
            disabled={!name}
            onSubmit={handleSubmit}
            className='w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
          >
            Dodaj
          </button>
        </section>
      </form>
    </div>
  )
}

export default Index
