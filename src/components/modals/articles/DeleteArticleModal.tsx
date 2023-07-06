import { FormEvent } from 'react'
import { trpcClient } from '../../../utils/api'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
  Article,
  CategoriesOnArticle,
  Image,
  Category,
  ArticleAction,
} from '@prisma/client'

import Textarea from '../../Textarea'
import FieldSet from '../../Fieldset'
import Select from 'react-select'
import { Dialog } from '@headlessui/react'
import * as Ai from 'react-icons/ai'
import { toast } from 'react-toastify'
import axios from 'axios'

type TArticle = Article & {
  image: Image[]
  brand: {
    name: string
  } | null
  categories: (CategoriesOnArticle & {
    category: Category
  })[]
  action: ArticleAction | null
  attributes: { title: string; text: string; id: string }[]
}

type TProps = {
  article: TArticle
  isOpen: boolean
  setArticle: React.Dispatch<React.SetStateAction<TArticle>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteArticleModal = ({
  isOpen,
  article,
  setIsOpen,
  setArticle,
}: TProps) => {
  const queryClient = useQueryClient()

  const { data: brands } = useQuery(['brand.getAllBrands'], () =>
    trpcClient.brand.getAllBrands.query()
  )

  const brand_options =
    brands?.map((brand) => ({
      label: brand.name,
      value: brand.id,
    })) || []

  const value = brand_options.find(
    (option) => option.label === article?.brand?.name
  )

  const warranty_options = [
    { label: '1 Godina', value: '1 Godina' },
    { label: '2 Godine', value: '2 Godine' },
    { label: '3 Godine', value: '3 Godine' },
    { label: '5 Godina', value: '5 Godina' },
    { label: '25 Godina', value: '25 Godina' },
  ]

  const warranty_value = warranty_options.find(
    (option) => option.value === article.warranty
  )

  const { mutate: deleteArticle } = useMutation(
    () => trpcClient.article.deleteArticle.mutate({ id: article.id }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['articles.getAllArticles'])

        if (article.olx_id) {
          axios
            .delete(`/api/olx/listings?id=${article.olx_id}`)
            .then(() => toast.success('Obrisano na OLX-u'))
            .catch(() => toast.error('Došlo je do greške pri izmjeni na OLX-u'))
        }
        setArticle({} as TArticle)
        setIsOpen(false)
      },
    }
  )

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    deleteArticle()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        setArticle({} as TArticle)
      }}
    >
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setArticle({} as TArticle)
          }}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <form
            onSubmit={handleSubmit}
            className='flex h-full w-full flex-col justify-evenly overflow-y-auto rounded-xl bg-white p-10 drop-shadow-2xl sm:h-[80vh] sm:max-w-screen-sm sm:pt-52'
          >
            <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
              Izbriši artikal
            </h1>
            <FieldSet
              type='text'
              label='Naziv'
              name='name'
              readOnly={true}
              value={article.name}
            />
            <Textarea
              label='Opis artikla'
              readOnly
              rows={4}
              id='message'
              value={article.description}
              name='description'
              placeholder='Opišite artikal'
            />
            <Textarea
              rows={4}
              id='message'
              readOnly
              label='Kratki opis'
              value={article.short_description || ''}
              name='short_description'
              placeholder='Opišite artikal'
            />
            <fieldset className='flex w-full flex-col items-center'>
              <label className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'>
                Garancija
              </label>
              <div className='w-4/5'>
                <Select
                  placeholder='Garancija'
                  options={warranty_options}
                  value={warranty_value || null}
                  isDisabled
                />
              </div>
            </fieldset>
            <FieldSet
              value={article.base_price}
              readOnly
              name='base_price'
              label='Cijena'
              type='number'
            />
            <fieldset className='flex w-full flex-col items-center'>
              <label className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'>
                Brend
              </label>
              <div className='w-4/5'>
                <Select
                  options={brand_options}
                  placeholder='Brend'
                  value={value || null}
                  isDisabled
                />
              </div>
            </fieldset>
            <section className='mt-5 flex w-full items-center justify-center'>
              <button
                onSubmit={handleSubmit}
                className='w-4/5 rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              >
                Izbriši
              </button>
            </section>
            <Ai.AiFillCloseCircle
              onClick={() => {
                setIsOpen(false)
                setArticle({} as TArticle)
              }}
              className='absolute top-4 right-4 block h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800 sm:hidden'
            />
          </form>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteArticleModal
