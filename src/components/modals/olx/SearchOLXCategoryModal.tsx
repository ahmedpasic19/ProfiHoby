import { useState, FormEvent } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'
import { Category, Group } from '@prisma/client'
import { toast } from 'react-toastify'
import axios from 'axios'

import { Dialog } from '@headlessui/react'

import FormButton from '../../mics/FormButton'
import Spinner from '../../mics/Spinner'

type TProps = {
  group: Group
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setGroup: React.Dispatch<React.SetStateAction<Group & { category: Category }>>
}

type TCategory = {
  id: number
  name: string
  path: string
}

const SearchOLXCategoryModal = ({
  group,
  isOpen,
  setIsOpen,
  setGroup,
}: TProps) => {
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState({} as TCategory)
  const [categories, setCategories] = useState([] as TCategory[])
  const [isLoading, setIsLoading] = useState(false)

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

  const onClose = () => {
    setIsOpen(false)
    setGroup({} as Group & { category: Category })
    setCategories([] as TCategory[])
    setSelectedCategory({} as TCategory)
    setIsLoading(false)
    setName('')
  }

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      // Encode url
      const uri = encodeURI(`/api/olx/olx-category?name=${name}`)

      const categories: { data: TCategory[] } = await axios.get(uri)

      setCategories(categories.data || [])
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const { mutate: updateGroup, isLoading: loadingUpdate } = useMutation(
    (input: {
      id: string
      name: string
      category_id: string
      olx_category_id: string
      articles: { id: string }[]
    }) => trpcClient.group.updateGroup.mutate(input),
    {
      onSuccess: async () => {
        onClose()
        await invalidateQueries()
      },
    }
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!selectedCategory.id) return toast.error('Odaberite OLX kategoriju')

    updateGroup({
      ...group,
      olx_category_id: selectedCategory.id.toString(),
      articles: [],
    })
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className='fixed inset-0'>
        <div className='absolute h-full w-full bg-black/30' onClick={onClose} />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <div className='relative z-10 w-full max-w-2xl rounded-xl bg-white p-10'>
            <form className='grid w-full grid-cols-3 justify-center p-2'>
              <input
                autoComplete='off'
                placeholder='Pretraži OLX kategorije'
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                className='sm:text-md col-span-2 w-full rounded-sm p-2 pl-3 text-lg outline-none'
              />
              <button
                onClick={handleSearch}
                className='col-span-1 flex items-center justify-center rounded-md bg-gray-800 p-2 text-white'
              >
                {isLoading ? <Spinner /> : 'Pretraži'}
              </button>
            </form>
            <ul className='mt-5 flex h-[400px] w-full flex-col  gap-4 overflow-y-auto border-t-2 border-gray-400 py-5'>
              {categories?.map((cat) => (
                <li
                  className={`h-fit w-full cursor-pointer border-2 border-gray-200 p-3 ${
                    selectedCategory.id === cat.id ? 'bg-gray-200' : ''
                  }`}
                  key={Math.random()}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <p>
                    <b>Naziv: {cat.name}</b>
                  </p>
                  <p>{cat.path}</p>
                </li>
              ))}
            </ul>
            <section className='flex w-full items-center justify-center'>
              <FormButton
                onSubmit={handleSubmit}
                onClick={handleSubmit}
                isLoading={loadingUpdate}
                text='Sačuvaj'
              />
            </section>

            <AiFillCloseCircle
              onClick={onClose}
              className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
            />
          </div>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default SearchOLXCategoryModal
