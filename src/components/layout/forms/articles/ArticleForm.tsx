import { FormEvent, ChangeEvent, useState, useRef } from 'react'
import { Article } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../../utils/api'
// import axios from 'axios'
import { toast } from 'react-toastify'

import FieldSet from '../../../mics/Fieldset'
import Textarea from '../../../mics/Textarea'
import Select from 'react-select'
import Attribute from './attributes/Attribute'
import Spinner from '../../../mics/Spinner'

import { AiFillCheckSquare } from 'react-icons/ai'
import { formatTextContent } from '../../../../utils/formatText'

type TArticle = Article & {
  attributes: { title: string; text: string; id: string }[]
}

type TProps = {
  setArticleData: React.Dispatch<React.SetStateAction<TArticle>>
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  setArticleId: React.Dispatch<React.SetStateAction<string | null>>
  articleData: TArticle
  pageIndex: number
}

const ArticleForm = ({
  setArticleData,
  setPageIndex,
  setArticleId,
  articleData,
  pageIndex,
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

  const { data: brands } = useQuery(['brand.getAllBrands'], () =>
    trpcClient.brand.getAllBrands.query()
  )

  const { mutate: postArticle, isLoading } = useMutation(
    (input: {
      name: string
      description: string
      short_description: string | null
      warranty: string | null
      base_price: number
      attributes: { text: string; title: string }[]
    }) => trpcClient.article.createArticle.mutate(input),
    {
      onSuccess: async (data) => {
        if (!data) return toast.error('Greška na serveru')
        setArticleId(data.id)
        setArticleData({} as TArticle)
        await queryClient.invalidateQueries(['articles.getAllArticles'])
        if (pageIndex !== 2) setPageIndex((prev) => prev + 1)
        else setPageIndex(0)

        // axios
        //   .post(`/api/olx/listings?id=${data.id}`)
        //   .catch(console.error)
      },
    }
  )

  // Subimit data to api
  const createArticle = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()

    if (
      !articleData.base_price ||
      !articleData.description ||
      !articleData.name
    )
      return
    articleData.base_price = parseFloat(articleData.base_price.toString())
    articleData.description = formatTextContent(articleData.description)
    articleData.short_description = formatTextContent(
      articleData.short_description || ''
    )
    articleData.attributes = articleData.attributes?.length
      ? articleData.attributes
      : []

    postArticle(articleData)
  }

  // onChange for inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setArticleData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Remove attribute
  const handleRemoveAttribute = (id: string) => {
    setArticleData((prev) => {
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
      ...(articleData?.attributes ? articleData?.attributes : []),
      attribute,
    ]

    setArticleData((prev) => ({
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

    const newAttributes = [...(articleData?.attributes || [])]

    // Find attribute user is editing
    const index = newAttributes.findIndex((att) => att.id === newAttribute.id)

    if (index === -1) return
    newAttributes.splice(index, 1, newAttribute)

    setArticleData((prev) => {
      return { ...prev, attributes: newAttributes }
    })
    handleCloseEdit()
  }

  const brand_options =
    brands?.map((brand) => ({
      label: brand.name,
      value: brand.id,
    })) || []

  const value = brand_options.find(
    (option) => option.value === articleData?.brand_id
  )

  const warranty_options = [
    { label: '1 Godina', value: '1 Godina' },
    { label: '2 Godine', value: '2 Godine' },
    { label: '3 Godine', value: '3 Godine' },
    { label: '5 Godina', value: '5 Godina' },
    { label: '25 Godina', value: '25 Godina' },
  ]

  const warranty_value = warranty_options.find(
    (option) => option.value === articleData.warranty
  )

  return (
    <form
      onSubmit={createArticle}
      className='relative h-full w-full p-10 sm:w-3/4 sm:pb-5'
    >
      <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
        Dodaj artikal
      </h1>
      <FieldSet
        value={articleData.name || ''}
        onChange={handleChange}
        name='name'
        label='Naziv'
        type='text'
      />
      <fieldset className='flex w-full flex-col items-center'>
        <label
          htmlFor='message'
          className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'
        >
          Opis artikla
        </label>
        <Textarea
          onChange={handleChange}
          rows={4}
          id='message'
          name='description'
          placeholder='Opišite artikal'
        />
      </fieldset>
      <fieldset className='flex w-full flex-col items-center'>
        <label
          htmlFor='message'
          className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'
        >
          Kratki opis
        </label>
        <Textarea
          onChange={handleChange}
          rows={4}
          id='message'
          name='short_description'
          placeholder='Opišite artikal'
        />
      </fieldset>
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
              setArticleData((prev) => ({ ...prev, warranty: option.value }))
            }}
          />
        </div>
      </fieldset>
      <FieldSet
        value={articleData.base_price || ''}
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
              setArticleData({ ...articleData, brand_id: option.value })
            }
          />
        </div>
      </fieldset>

      {/* Article attributes */}
      <section>
        <h2 className='text-lg font-semibold text-gray-800'>Atributi</h2>
        <ul className='my-2 max-h-44 overflow-y-auto border-2 border-gray-200 bg-gray-100 text-gray-800'>
          {articleData?.attributes?.map((att) => (
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
          <fieldset>
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
          <fieldset>
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
            <AiFillCheckSquare className='absolute bottom-2 h-7 w-7 text-gray-800 hover:text-gray-600' />
          </button>
        </div>
      </section>

      <section className='mt-10 flex w-full items-center justify-center pb-10'>
        <button
          disabled={
            !articleData.base_price ||
            !articleData.description ||
            !articleData.name
          }
          onSubmit={createArticle}
          className='flex w-4/5 items-center justify-center rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
        >
          {isLoading ? <Spinner /> : 'Dodaj'}
        </button>
      </section>
    </form>
  )
}

export default ArticleForm
