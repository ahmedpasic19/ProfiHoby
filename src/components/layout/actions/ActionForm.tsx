import { FormEvent, ChangeEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../utils/api'
import { ArticleAction } from '@prisma/client'

import Textarea from '../../Textarea'
import FieldSet from '../../Fieldset'
import FormButton from '../../FormButton'
import * as Ai from 'react-icons/ai'

type TProps = {
  action: Partial<ArticleAction>
  setAction: React.Dispatch<React.SetStateAction<ArticleAction>>
  setPageIndex: React.Dispatch<React.SetStateAction<number>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ActionForm = ({ action, setAction, setPageIndex, setIsOpen }: TProps) => {
  const queryClient = useQueryClient()

  const { mutate: createAction, isLoading } = useMutation(
    (input: {
      discount: number
      title: string
      date: Date | undefined
      description: string | undefined
    }) => trpcClient.article_action.createArticleAction.mutate(input),
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries([
          'article_action.getAllArticleActions',
        ])
        setPageIndex(1)
        setAction(data)
      },
    }
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'discount')
      setAction((prev) => ({
        ...prev,
        [e.target.name]: parseFloat(e.target.value),
      }))
    else setAction((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    e.preventDefault()
    if (!action.discount || !action.title) return
    createAction({
      discount: action.discount,
      title: action.title,
      date: action.date || undefined,
      description: action.description || undefined,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='relative h-[584px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
    >
      <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
        Započni akciju
      </h1>
      <FieldSet
        type='text'
        label='Naziv'
        name='title'
        value={action?.title}
        onChange={handleChange}
      />
      <FieldSet
        type='number'
        label='Popust'
        name='discount'
        value={action?.discount}
        onChange={handleChange}
      />
      <Textarea
        rows={5}
        label='Opis'
        id='description'
        name='description'
        htmlFor='description'
        placeholder='Dodaj opis'
        onChange={(e) =>
          setAction((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
      />
      <section className='flex w-full items-center justify-center'>
        <FormButton
          onSubmit={handleSubmit}
          disabled={isLoading}
          isLoading={isLoading}
          text='Dodaj'
        />
      </section>
      <Ai.AiFillCloseCircle
        onClick={() => {
          setIsOpen(false)
          setAction({} as ArticleAction)
        }}
        className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
      />
    </form>
  )
}

export default ActionForm
