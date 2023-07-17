import { useState, FormEvent, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../../../utils/api'
import { Brand } from '@prisma/client'

import Select from 'react-select'
import FieldSet from '../../../mics/Fieldset'
import { AiFillCloseCircle } from 'react-icons/ai'

type TProps = {
  brand?: Brand
  isEditing?: boolean
  isDeleting?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setBrand?: React.Dispatch<React.SetStateAction<Brand>>
}

const BrandForm = ({
  brand,
  isEditing,
  isDeleting,
  setIsOpen,
  setBrand,
}: TProps) => {
  const [name, setName] = useState('')
  const [group, setGroup] = useState({} as { label: string; value: string })

  const queryClient = useQueryClient()

  // Invalidate all queries
  const invalidateQueries = async () => {
    await queryClient.invalidateQueries(['brand.getAllBrands'])
    await queryClient.invalidateQueries(['article.index.page'])
  }

  const { data: allGroups } = useQuery(['group.getAllGroups'], () =>
    trpcClient.group.getAllGroups.query()
  )

  const groupOptions =
    allGroups?.map((group) => ({
      label: group.name,
      value: group.id,
    })) || []

  const { mutate: createBrand } = useMutation(
    (input: { name: string; article_ids: string[]; group_id: string }) =>
      trpcClient.brand.createBrand.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setIsOpen && setIsOpen(false)
        setName('')
        setGroup({} as { label: string; value: string })
      },
    }
  )
  const { mutate: updateBrand } = useMutation(
    (input: {
      id: string
      name: string
      article_ids: string[]
      group_id: string
    }) => trpcClient.brand.updateBrand.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setName('')
        setIsOpen && setIsOpen(false)
        setBrand && setBrand({} as Brand)
      },
    }
  )
  const { mutate: deleteBrand } = useMutation(
    (input: { id: string }) => trpcClient.brand.deleteBrand.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setName('')
        setIsOpen && setIsOpen(false)
        setBrand && setBrand({} as Brand)
      },
    }
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name) return
    if (!isEditing && !isDeleting)
      createBrand({ name, article_ids: [], group_id: group.value })
    if (isEditing && brand?.id)
      updateBrand({
        id: brand.id,
        name,
        article_ids: [],
        group_id: group.value,
      })
    if (isDeleting && brand?.id) deleteBrand({ id: brand.id })
  }

  // On opening modal set default values to state
  useEffect(() => {
    setName(brand?.name || '')
  }, [])

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='relative flex w-[500px] flex-col items-center justify-center rounded-xl bg-white py-20'
      >
        <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
          {isEditing
            ? 'Izmjeni brend'
            : isDeleting
            ? 'Izbriši brend'
            : 'Dodaj brend'}
        </h1>
        <FieldSet
          label='Naziv'
          name='name'
          value={name}
          readOnly={isDeleting}
          onChange={(e) => setName(e.target.value)}
          type='text'
        />
        <fieldset className='flex w-4/5 flex-col'>
          <label className='text-cl mb-2 text-start text-xl font-semibold text-gray-800'>
            Grupa
          </label>
          <Select
            options={groupOptions}
            value={Object.keys(group).length ? group : null}
            onChange={(option) => option && setGroup(option)}
            placeholder='Odaberi grupu'
          />
        </fieldset>
        <section className='mt-10 flex w-full items-center justify-center'>
          <button
            disabled={!name}
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
              setBrand && setBrand({} as Brand)
            }}
            className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
          />
        )}
      </form>
    </div>
  )
}

export default BrandForm
