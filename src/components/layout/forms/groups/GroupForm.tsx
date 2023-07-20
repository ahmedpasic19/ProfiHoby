import { useState, FormEvent, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../../utils/api'
import { Category, Group } from '@prisma/client'

import Select, { SingleValue } from 'react-select'
import FieldSet from '../../../mics/Fieldset'
import Spinner from '../../../mics/Spinner'
import { AiFillCloseCircle } from 'react-icons/ai'

type TProps = {
  group?: Group & { category: Category }
  isEditing?: boolean
  isDeleting?: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setGroup?: React.Dispatch<
    React.SetStateAction<Group & { category: Category }>
  >
}

type TInput = {
  name: string
  articles: []
  category_id: string
}

type TCategoryOption = SingleValue<{ label: string; value: string }>

const GroupForm = ({
  group,
  isEditing,
  isDeleting,
  setIsOpen,
  setGroup,
}: TProps) => {
  const [name, setName] = useState('')
  const [order_key, setOrder_key] = useState(0)
  const [category, setCategory] = useState({} as TCategoryOption)

  const queryClient = useQueryClient()

  // Invalidate all queries
  const invalidateQueries = async () => {
    await queryClient.invalidateQueries(['group.getAllGroups'])
    await queryClient.invalidateQueries(['category.getAllCategories'])
    await queryClient.invalidateQueries([
      'articles',
      {
        pageSize: 100,
        pageIndex: 0,
        name: '',
        category: 'article.index.page',
      },
    ])
  }

  const { data: allCategories } = useQuery(['category.getAllCategories'], () =>
    trpcClient.category.getAllCategories.query()
  )
  const { mutate: createGroup, isLoading: loadingCreateGroup } = useMutation(
    (input: TInput) => trpcClient.group.createGroup.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setName('')
        setCategory({} as TCategoryOption)
        setIsOpen(false)
      },
    }
  )
  const { mutate: updateGroup, isLoading: loadingUpdateGroup } = useMutation(
    (input: TInput & { id: string; order_key: null | number }) =>
      trpcClient.group.updateGroup.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setName('')
        setIsOpen(false)
        setGroup && setGroup({} as Group & { category: Category })
        setCategory({} as TCategoryOption)
      },
    }
  )
  const { mutate: deleteGroup, isLoading: loadingDeleteGroup } = useMutation(
    (input: { id: string }) => trpcClient.group.deleteGroup.mutate(input),
    {
      onSuccess: async () => {
        await invalidateQueries()
        setName('')
        setIsOpen(false)
        setGroup && setGroup({} as Group & { category: Category })
        setCategory({} as TCategoryOption)
      },
    }
  )

  useEffect(() => {
    if (group && Object.keys(group).length) {
      setName(group.name)
      setCategory({ label: group.category.name, value: group.category.id })
      setOrder_key(group.order_key || 0)
    }
  }, [group])

  const categoryOptions = allCategories?.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name || !category?.value) return
    if (!isEditing && !isDeleting)
      createGroup({ name, category_id: category?.value, articles: [] })
    if (isEditing && group?.id)
      updateGroup({
        id: group.id,
        name,
        order_key,
        category_id: category?.value,
        articles: [],
      })
    if (isDeleting && group?.id) deleteGroup({ id: group.id })
  }

  return (
    <div className={`flex w-full flex-col items-center justify-center`}>
      <form
        onSubmit={handleSubmit}
        className='relative flex w-[500px] flex-col items-center justify-center rounded-xl bg-white py-20'
      >
        <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
          {isEditing
            ? 'Izmjeni grupu'
            : isDeleting
            ? 'Izbriši grupu'
            : 'Dodaj grupu'}
        </h1>
        <FieldSet
          label='Naziv'
          name='name'
          value={name || ''}
          readOnly={isDeleting}
          onChange={(e) => setName(e.target.value)}
          type='text'
        />
        {isEditing && (
          <FieldSet
            label='Redni broj'
            name='order_key'
            value={order_key || ''}
            readOnly={isDeleting}
            onChange={(e) => setOrder_key(parseFloat(e.target.value))}
            type='text'
          />
        )}
        <div className='w-[80%]'>
          <label className='w-full pl-4 text-xl font-medium text-gray-800'>
            Kategorija
          </label>
          <Select
            isDisabled={isDeleting}
            options={categoryOptions}
            value={category?.value ? category : null}
            placeholder='Odaberi kategoriju'
            onChange={(option) => {
              if (option) setCategory(option)
            }}
          />
        </div>
        <section className='mt-10 flex w-full items-center justify-center'>
          <button
            disabled={!name || !Object.keys(category || {}).length}
            onSubmit={handleSubmit}
            className='flex w-4/5 items-center justify-center rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
          >
            {loadingCreateGroup || loadingUpdateGroup || loadingDeleteGroup ? (
              <Spinner />
            ) : isEditing ? (
              'Izmjeni'
            ) : isDeleting ? (
              'Izbriši'
            ) : (
              'Dodaj'
            )}
          </button>
        </section>
        {isEditing && (
          <AiFillCloseCircle
            onClick={() => {
              setIsOpen(false)
              setGroup && setGroup({} as Group & { category: Category })
            }}
            className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
          />
        )}
      </form>
    </div>
  )
}

export default GroupForm
