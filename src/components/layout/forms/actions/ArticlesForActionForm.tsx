import { useState, useMemo, FormEvent, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../../utils/api'
import { ArticleAction } from '@prisma/client'
import { TArticle } from '../../../../types/article'

import SearchComponent from '../../../SearchComponent'
import FormButton from '../../../FormButton'
import Article from '../../../Article'
import { ImCheckboxChecked } from 'react-icons/im'
import { AiFillCloseCircle } from 'react-icons/ai'

type TProps = {
  actionArticles?: boolean
  action: ArticleAction
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPageIndex?: React.Dispatch<React.SetStateAction<number>>
  setAction: React.Dispatch<React.SetStateAction<ArticleAction>>
}

const ArticlesForActionForm = ({
  actionArticles,
  action,
  setIsOpen,
  setPageIndex,
  setAction,
}: TProps) => {
  const [name, setName] = useState('')
  const [selectedArticles, setSelectedArticles] = useState<TArticle[]>([])

  const queryClient = useQueryClient()

  const { data: articles, refetch } = useQuery(
    ['articles.getArticlesByName', { name }],
    () =>
      trpcClient.article.getArticlesByName.query({
        name,
      })
  )

  const { data: action_articles } = useQuery(
    ['article.getArticlesByActionID', { id: action.id }],
    () => trpcClient.article.getArticlesByActionID.query({ id: action.id }),
    {
      enabled: actionArticles,
    }
  )

  const { mutate: updateAction, isLoading } = useMutation(
    (input: {
      id: string
      title: string
      discount: number
      description: string | null
      date: Date | null
      articles: TArticle[]
    }) => trpcClient.article_action.updateArticleAction.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'article_action.getAllArticleActions',
        ])
        await queryClient.invalidateQueries([
          'article.getArticlesByActionID',
          { id: action.id },
        ])

        setPageIndex && setPageIndex((prev) => prev + 1)
        setSelectedArticles([])
      },
    }
  )

  useEffect(() => {
    setSelectedArticles(action_articles || [])
  }, [action_articles])

  const data = useMemo(() => articles, [articles])

  const handleSelectArticle = (article: TArticle) => {
    const selected = selectedArticles.find((art) => article.id === art.id)

    if (selected) {
      // deselect if selected
      const new_articles = selectedArticles.filter(
        (art) => art.id !== article.id
      )
      setSelectedArticles(new_articles)
    } else setSelectedArticles((prev) => [...prev, article])
  }

  const handleAddArticles = (e: FormEvent) => {
    e.preventDefault()

    updateAction({ ...action, articles: selectedArticles })
  }

  return (
    <div className='relative z-10 rounded-xl bg-white p-10'>
      <form>
        <div>
          <SearchComponent
            filter={name}
            filter_name='name'
            refetch={refetch}
            displayBtn={false}
            handleChange={(e) => setName(e.target.value)}
          />
        </div>
        <ul className='mt-5 grid h-[400px] w-full grid-cols-2 flex-col gap-4 overflow-y-auto border-t-2 border-gray-400 pt-5'>
          {(data?.length ? data : selectedArticles)?.map((article) => {
            const selected = selectedArticles.find(
              (art) => article.id === art.id
            )
            return (
              <li
                onClick={() => handleSelectArticle(article)}
                key={Math.random()}
                className='relative z-10 mb-1 flex items-center justify-center'
              >
                <Article
                  disableLink
                  article_id={article.id}
                  categories={article.categories}
                  description={article.description}
                  price={article.base_price}
                  name={article.name}
                  imageURL={article?.image[0]?.url || ''}
                />
                {selected && (
                  <ImCheckboxChecked className='absolute top-10 right-5 h-8 w-8 text-blue-600' />
                )}
              </li>
            )
          })}
        </ul>
        <section className='flex w-full items-center justify-center'>
          <FormButton
            onSubmit={handleAddArticles}
            onClick={handleAddArticles}
            isLoading={isLoading}
            text={actionArticles ? 'Izmjeni' : 'Dodaj'}
          />
        </section>
      </form>

      <AiFillCloseCircle
        onClick={() => {
          setIsOpen(false)
          setAction({} as ArticleAction)
          setSelectedArticles([])
        }}
        className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
      />
    </div>
  )
}

export default ArticlesForActionForm
