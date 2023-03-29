import { FormEvent, ChangeEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../../utils/api'
import { ArticleAction } from '@prisma/client'
import { TArticle } from '../../../../types/article'

import Textarea from '../../../Textarea'
import FieldSet from '../../../Fieldset'
import FormButton from '../../../FormButton'
import * as Ai from 'react-icons/ai'

type TProps = {
  isEditing?: boolean
  isDeleting?: boolean
  action: ArticleAction
  setAction: React.Dispatch<React.SetStateAction<ArticleAction>>
  setPageIndex?: React.Dispatch<React.SetStateAction<number>>
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ActionForm = ({
  isDeleting,
  isEditing,
  action,
  setAction,
  setPageIndex,
  setIsOpen,
}: TProps) => {
  const queryClient = useQueryClient()

  const { mutate: createAction, isLoading: loadingCreate } = useMutation(
    (input: {
      discount: number
      title: string
      date: Date | null
      description: string | undefined
    }) => trpcClient.article_action.createArticleAction.mutate(input),
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries([
          'article_action.getAllArticleActions',
        ])
        setPageIndex && setPageIndex(1)
        setAction(data)
      },
    }
  )

  const { mutate: updateAction, isLoading: loadingUpdate } = useMutation(
    (input: {
      id: string
      title: string
      discount: number
      description: string | null
      date: Date | null
      articles: TArticle[]
    }) => trpcClient.article_action.updateArticleAction.mutate(input),
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries([
          'article_action.getAllArticleActions',
        ])
        setPageIndex && setPageIndex(1)
        setAction(data)
      },
    }
  )

  const { mutate: deleteAction, isLoading: loadingDelete } = useMutation(
    (input: { id: string }) =>
      trpcClient.article_action.deleteArticleAction.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'article_action.getAllArticleActions',
        ])
        await queryClient.invalidateQueries([
          'article.getArticlesByActionID',
          { id: action.id },
        ])
        setPageIndex && setPageIndex(0)
        setAction({} as ArticleAction)
        setIsOpen(false)
      },
    }
  )

  const { data: action_articles } = useQuery(
    ['article.getArticlesByActionID', { id: action.id }],
    () =>
      trpcClient.article.getArticlesByActionID.query({ id: action.id || '' }),
    {
      enabled: isEditing,
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

    if (!isEditing && !isDeleting) {
      if (!action.discount || !action.title) return
      createAction({
        discount: action.discount,
        title: action.title,
        date: action.date || null,
        description: action.description || undefined,
      })
    }

    if (isEditing) updateAction({ ...action, articles: action_articles || [] })

    if (isDeleting) {
      if (!action.id) return
      deleteAction({ id: action.id })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='relative h-[584px] w-[450px] rounded-xl bg-white p-10 drop-shadow-2xl'
    >
      <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
        {isEditing
          ? 'Izmjeni akciju'
          : isDeleting
          ? 'Obriši akciju'
          : 'Započni akciju'}
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
        value={action?.description || ''}
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
          disabled={loadingCreate || loadingUpdate || loadingDelete}
          isLoading={loadingCreate || loadingUpdate || loadingDelete}
          text={isEditing ? 'Izmjeni' : isDeleting ? 'Obriši' : 'Dodaj'}
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
