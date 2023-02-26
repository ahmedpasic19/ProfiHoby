import { FormEvent } from 'react'
import { Dialog } from '@headlessui/react'
import FieldSet from '../../Fieldset'
import * as Ai from 'react-icons/ai'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Article, CategoriesOnArticle, Image } from '@prisma/client'
import { trpcClient } from '../../../utils/api'

type TArticle = Article & {
  image: Image[]
  categories: CategoriesOnArticle[]
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

  const { mutate: deleteArticle } = useMutation(
    () => trpcClient.article.deleteArticle.mutate({ id: article.id }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'articles',
          { category: '', name: '', pageIndex: 0, pageSize: 100 },
        ])
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
        <Dialog.Title>Izbriši artikal</Dialog.Title>

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <form
            onSubmit={handleSubmit}
            className='flex min-h-[584px] w-[450px] flex-col justify-evenly rounded-xl bg-white p-10 drop-shadow-2xl'
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
            <fieldset className='flex w-full flex-col items-center'>
              <label
                htmlFor='message'
                className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'
              >
                Opis artikla
              </label>
              <textarea
                readOnly
                rows={4}
                id='message'
                value={article.description}
                name='description'
                className='block w-4/5 rounded-lg border-2 border-gray-800 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                placeholder='Opišite artikal'
              ></textarea>
            </fieldset>
            <FieldSet
              value={article.base_price}
              readOnly={true}
              name='base_price'
              label='Cijena'
              type='number'
            />
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
              className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
            />
          </form>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteArticleModal
