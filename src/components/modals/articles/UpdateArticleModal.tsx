import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { Article, Image, CategoriesOnArticle, Category } from '@prisma/client'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'
import { toast } from 'react-toastify'
import axios from 'axios'

import FieldSet from '../../Fieldset'
import Textarea from '../../Textarea'
import Select from 'react-select'
import Attribute from '../../layout/forms/articles/attributes/Attribute'
import Spinner from '../../Spinner'

import { Dialog } from '@headlessui/react'
import * as Ai from 'react-icons/ai'

import { formatTextContent, parseTextFormat } from '../../../utils/formatText'

type TArticle = Article & {
  image: Image[]
  brand: {
    name: string
  } | null
  categories: (CategoriesOnArticle & {
    category: Category
  })[]
  attributes: { title: string; text: string; id: string }[]
}

type TProps = {
  article: TArticle
  isOpen: boolean
  setArticle: React.Dispatch<React.SetStateAction<TArticle>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateArticleModal = ({
  isOpen,
  article,
  setIsOpen,
  setArticle,
}: TProps) => {
  const [attribute, setAttribute] = useState({
    title: '',
    text: '',
    id: Math.random().toString(),
  })
  const [selectedAtribute, setSelectedAtribute] = useState({
    title: '',
    text: '',
    id: Math.random().toString(),
  })

  const queryClient = useQueryClient()

  // ref to attribute title iput
  // onSubmit of ew attribute, focus on the attribute title input
  const title_ref = useRef<HTMLInputElement>(null)

  // Remove attribute
  const handleRemoveAttribute = (id: string) => {
    setArticle((prev) => {
      const newAttributes = [...(prev?.attributes || [])]

      // Remove attrbute
      const filtered = newAttributes.filter((item) => item.id !== id)
      return { ...prev, attributes: filtered }
    })
  }

  // New attribute onChange
  const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAttribute((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Submit new attribute
  const handleAddAttribute = (e: FormEvent) => {
    e.preventDefault()
    if (!attribute.text || !attribute.title) return

    const values = [
      ...(article?.attributes ? article?.attributes : []),
      attribute,
    ]

    setArticle((prev) => ({
      ...prev,
      attributes: values,
    }))
    setAttribute({ title: '', text: '', id: Math.random().toString() }) // clear inputs
    title_ref?.current?.focus()
  }

  // Select attribute for edit
  const handleSelectForEdit = (attribute: {
    text: string
    title: string
    id: string
  }) => {
    setSelectedAtribute(attribute)
  }

  // Cancle edit
  const handleCloseEdit = () => {
    setSelectedAtribute({ text: '', title: '', id: Math.random().toString() })
  }

  // Submit edit
  const handleSubmitEdit = (newAttribute: {
    title: string
    text: string
    id: string
  }) => {
    if (!newAttribute.text || !newAttribute.title) return

    const newAttributes = [...(article?.attributes || [])]

    // Find attribute user is editing
    const index = newAttributes.findIndex((att) => att.id === newAttribute.id)

    if (index === -1) return
    newAttributes.splice(index, 1, newAttribute)

    setArticle((prev) => {
      return { ...prev, attributes: newAttributes }
    })
    handleCloseEdit()
  }

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

  const { mutate: updateArticle, isLoading } = useMutation(
    (input: {
      id: string
      name: string
      description: string
      short_description: string | null
      base_price: number
      brand_id: string | null
      attributes: { text: string; title: string }[]
    }) => trpcClient.article.updateArticle.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['articles.getAllArticles'])

        axios
          .put(`/api/olx/listings?id=${article.id}`)
          .then(() => toast.success('Izmjenjeno na OLX-u'))
          .catch(() => toast.error('Došlo je do greške pri izmjeni na OLX-u'))

        setArticle({} as TArticle)
        setIsOpen(false)
      },
    }
  )

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setArticle((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    // Check for selected brand
    const brand = brand_options.find(
      (option) => option.label === article?.brand?.name
    )

    const updatedArticle = {
      ...article,
      ...(brand ? { brand_id: brand?.value } : {}), // optionaly send brand_id
    }

    updatedArticle.base_price = parseFloat(updatedArticle.base_price.toString())
    updatedArticle.description = formatTextContent(updatedArticle.description)
    updatedArticle.short_description = formatTextContent(
      updatedArticle.short_description || ''
    )
    updatedArticle.attributes = updatedArticle.attributes?.length
      ? updatedArticle.attributes
      : []

    updateArticle(updatedArticle)
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
            className='flex h-full w-full flex-col justify-evenly overflow-y-auto rounded-xl bg-white p-10 drop-shadow-2xl sm:h-[80vh] sm:max-w-screen-sm sm:pt-[30rem]'
          >
            <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
              Izmjeni artikal
            </h1>
            <FieldSet
              type='text'
              label='Naziv'
              name='name'
              value={article.name}
              onChange={handleChange}
            />
            <Textarea
              rows={4}
              id='message'
              label='Opis artikla'
              value={
                article?.description?.includes('[sp]') ||
                article?.description?.includes('[tab]') ||
                article?.description?.includes('[nl]')
                  ? parseTextFormat(article?.description)
                  : article?.description || ''
              }
              onChange={handleChange}
              name='description'
              placeholder='Opišite artikal'
            />
            <Textarea
              rows={4}
              id='message'
              label='Kratki opis'
              value={
                article?.short_description?.includes('[sp]') ||
                article?.short_description?.includes('[tab]') ||
                article?.short_description?.includes('[nl]')
                  ? parseTextFormat(article?.short_description)
                  : article?.short_description || ''
              }
              onChange={handleChange}
              name='short_description'
              placeholder='Opišite artikal'
            />
            <fieldset className='flex w-full flex-col items-center'>
              <label
                htmlFor='warranty'
                className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'
              >
                Garancija
              </label>
              <div className='w-4/5'>
                <Select
                  placeholder='Garancija'
                  options={warranty_options}
                  value={warranty_value || null}
                  onChange={(option) => {
                    if (!option) return
                    setArticle((prev) => ({
                      ...prev,
                      warranty: option.value,
                    }))
                  }}
                />
              </div>
            </fieldset>
            <FieldSet
              value={article.base_price}
              onChange={handleChange}
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
                  placeholder='Odaberi brend'
                  value={value || null}
                  onChange={(option) =>
                    option &&
                    setArticle({ ...article, brand: { name: option.label } })
                  }
                />
              </div>
            </fieldset>

            {/* Article attributes */}
            <section>
              <h2 className='text-lg font-semibold text-gray-800'>Atributi</h2>
              <ul className='my-2 max-h-44 overflow-y-auto border-2 border-gray-200 bg-gray-100 text-gray-800'>
                {article?.attributes?.map((att) => (
                  <Attribute
                    key={Math.random()}
                    attribute={att}
                    remove={handleRemoveAttribute}
                    edit={handleSelectForEdit}
                    handleSubmitEdit={handleSubmitEdit}
                    selectedAttribute={selectedAtribute}
                    handleCloseEdit={handleCloseEdit}
                  />
                ))}
              </ul>
              <div className='relative my-2 flex w-full items-center justify-evenly p-2'>
                <fieldset className='flex flex-col'>
                  <label className='font-semibold text-gray-800'>Naziv</label>
                  <input
                    ref={title_ref}
                    placeholder='Naziv'
                    value={attribute.title || ''}
                    name='title'
                    className='rounded-sm border-2 border-gray-400 pl-2 outline-none'
                    onChange={handleAttributeChange}
                  />
                </fieldset>
                <fieldset className='flex flex-col'>
                  <label className='font-semibold text-gray-800'>Opis</label>
                  <input
                    placeholder='Opis'
                    value={attribute.text || ''}
                    name='text'
                    onChange={handleAttributeChange}
                    className='rounded-sm border-2 border-gray-400 pl-2 outline-none'
                  />
                </fieldset>
                <button onClick={handleAddAttribute}>
                  <Ai.AiFillCheckSquare className='absolute bottom-2 h-7 w-7 text-gray-800 hover:text-gray-600' />
                </button>
              </div>
            </section>

            <section className='mt-5 flex w-full items-center justify-center'>
              <button
                onSubmit={handleSubmit}
                className='flex w-4/5 items-center justify-center rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
              >
                {isLoading ? <Spinner /> : 'Sačuvaj'}
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

export default UpdateArticleModal
