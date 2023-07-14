import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Article, CategoriesOnArticle, Category, Image } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'
import { applyDiscount } from '../../../utils/utils'
import { toast } from 'react-toastify'

import FieldSet from '../../Fieldset'
import FormButton from '../../FormButton'
import { Dialog } from '@headlessui/react'

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
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setArticle: React.Dispatch<React.SetStateAction<TArticle>>
}

type TInput = {
  onDiscount: boolean
  discountPrice?: number | null | undefined
  discountPercentage?: number | null | undefined
  id: string
  name: string
  attributes: { title: string; text: string }[]
  description: string
  base_price: number
}

const ArticleActionModal: React.FC<TProps> = ({
  article,
  isOpen,
  setIsOpen,
  setArticle,
}) => {
  const [discountData, setDiscountData] = useState({
    discountPrice: 0,
    discountPercentage: 0,
  })

  const queryClient = useQueryClient()

  const onClose = () => {
    setIsOpen(false)
    setArticle({} as TArticle)
    setDiscountData({
      discountPrice: 0,
      discountPercentage: 0,
    })
  }

  const { mutate: updateArticle, isLoading } = useMutation(
    (input: TInput) => trpcClient.article.updateArticle.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['articles.getAllArticles'])
        toast.success('Uspiješno')
        onClose()
      },
      onError: () => toast.error('Došlo je do greške'),
    }
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'discountPercentage') {
      const discountedPrice = applyDiscount(
        article.base_price,
        parseFloat(e.target.value)
      )

      setDiscountData({
        discountPrice: discountedPrice,
        discountPercentage: parseFloat(e.target.value),
      })
    } else
      setDiscountData((prev) => ({
        ...prev,
        [e.target.name]: parseFloat(e.target.value),
      }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    updateArticle({
      ...article,
      onDiscount: true,
      discountPrice: discountData?.discountPrice,
      discountPercentage: discountData?.discountPercentage,
    })
  }

  const handleRemove = (e: FormEvent) => {
    e.preventDefault()

    updateArticle({
      ...article,
      onDiscount: false,
      discountPrice: 0,
      discountPercentage: 0,
    })
  }

  useEffect(() => {
    setDiscountData((prev) => ({ ...prev, discountPrice: article.base_price }))
  }, [isOpen, article])

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className='fixed inset-0'>
        {' '}
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
            setArticle({} as TArticle)
          }}
        />
        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <form className='flex h-full w-full flex-col justify-between overflow-y-auto rounded-xl bg-white p-10 drop-shadow-2xl sm:h-[80vh] sm:max-w-screen-sm'>
            <div>
              <h2 className='w-full text-center text-2xl font-bold text-gray-800'>
                Odredi sniženje
              </h2>
              <FieldSet
                name='discountPrice'
                label='Cijena'
                type='number'
                onChange={handleChange}
                value={discountData.discountPrice}
              />
              <FieldSet
                name='discountPercentage'
                label='Postotak'
                type='number'
                onChange={handleChange}
                value={discountData.discountPercentage}
              />
            </div>
            <div className='flex w-full items-center justify-center gap-2'>
              <FormButton
                isLoading={isLoading}
                text='Sačuvaj'
                onClick={handleSubmit}
              />
              <FormButton
                isLoading={isLoading}
                text='Ukloni sniženje'
                onClick={handleRemove}
              />
            </div>
          </form>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default ArticleActionModal
