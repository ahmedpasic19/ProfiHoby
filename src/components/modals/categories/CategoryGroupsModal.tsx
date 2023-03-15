import { FormEvent, useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'
import { Group, Category } from '@prisma/client'

import Select, { MultiValue } from 'react-select'
import { Dialog } from '@headlessui/react'
import { AiFillCloseCircle } from 'react-icons/ai'

type TCategory = Category & { groups: Group[] }

type TProps = {
  isOpen: boolean
  category: TCategory
  setCategory: React.Dispatch<React.SetStateAction<TCategory>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CategoryGroupsModal = ({
  isOpen,
  category,
  setIsOpen,
  setCategory,
}: TProps) => {
  const [groups, setGroups] = useState<
    MultiValue<{ label: string; value: string }>
  >([])

  const queryClient = useQueryClient()

  const { data: allGroups } = useQuery(['group.getAllGroups'], () =>
    trpcClient.group.getAllGroups.query()
  )

  const { mutate: updateCategory } = useMutation(
    (input: Category & { groups: string[] }) =>
      trpcClient.category.updateCategory.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['group.getAllGroups'])
        await queryClient.invalidateQueries(['category.getAllCategories'])
        setIsOpen(false)
        setCategory({} as TCategory)
      },
    }
  )

  useEffect(() => {
    if (category?.groups) {
      const groups = category?.groups?.map((group) => ({
        label: group.name,
        value: group.id,
      }))

      setGroups(groups)
    }
  }, [category, isOpen])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const category_groups = groups.map((group) => group.value)

    updateCategory({ ...category, groups: category_groups })
  }

  const options = allGroups?.map((group) => ({
    label: group.name,
    value: group.id,
  }))

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
        <main className='flex h-full min-h-screen w-full items-center justify-center '>
          <form
            onSubmit={handleSubmit}
            className='relative h-[584px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
          >
            <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
              Dodaj grupe
            </h1>
            <Select
              options={options}
              value={groups}
              isMulti
              placeholder='Odaberi grupe'
              onChange={(value) => setGroups(value)}
            />
            <section className='relative mt-10 flex h-full w-full items-center justify-center'>
              <button
                onSubmit={handleSubmit}
                className='absolute bottom-44 w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              >
                Dodaj grupe
              </button>
            </section>
            <AiFillCloseCircle
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

export default CategoryGroupsModal
