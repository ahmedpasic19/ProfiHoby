import { useState, useMemo, FormEvent, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../../utils/api'
import { Group, Category } from '@prisma/client'
import { TArticle } from '../../../../types/article'

import SearchComponent from '../../../mics/SearchComponent'
import FormButton from '../../../mics/FormButton'
import Article from '../../../mics/Article'
import { ImCheckboxChecked } from 'react-icons/im'
import { AiFillCloseCircle } from 'react-icons/ai'

type TProps = {
  groupArticles?: boolean
  group: Group & { category: Category }
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPageIndex?: React.Dispatch<React.SetStateAction<number>>
  setGroup: React.Dispatch<React.SetStateAction<Group & { category: Category }>>
}

const ArticlesForGroupForm = ({
  groupArticles,
  group,
  setIsOpen,
  setPageIndex,
  setGroup,
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

  const { data: groups_articles } = useQuery(
    [
      'article.getArticlesByGroupID',
      { id: group.id },
      'article.getArticlesByGroupID',
    ],
    () =>
      trpcClient.article.getArticlesByGroupID.query({
        group_id: group.id,
        pageIndex: 0,
        pageSize: 10,
      }),
    {
      enabled: groupArticles,
    }
  )

  // assign articles to group mutation
  const { mutate: assignArticles, isLoading: loadingCreate } = useMutation(
    (input: { article_id: string; group_id: string }[]) =>
      trpcClient.articleGroups.createRelation.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['group.getAllGroups'])
        await queryClient.invalidateQueries(['article.getArticle'])
        await queryClient.invalidateQueries([
          'article.getArticlesByGroupID',
          { id: group.id },
        ])
        setIsOpen(false)
        setPageIndex && setPageIndex(0)
        setGroup({} as Group & { category: Category })
        setSelectedArticles([])
      },
    }
  )

  useEffect(() => {
    const articles =
      groups_articles?.group?.articles.map((article) => article.article) || []

    setSelectedArticles((articles as TArticle[]) || [])
  }, [groups_articles])

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
    const configured_articles = selectedArticles.map((art) => ({
      article_id: art.id,
      group_id: group.id,
    }))

    // Relate articles and selected group
    assignArticles(configured_articles)
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
                  price={article.base_price}
                  name={article.name}
                  imageURL={article?.image[0]?.access_url || ''}
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
            isLoading={loadingCreate}
            text={
              groups_articles?.group?.articles?.length ? 'Izmjeni' : 'Dodaj'
            }
          />
        </section>
      </form>

      <AiFillCloseCircle
        onClick={() => {
          setIsOpen(false)
          setGroup({} as Group & { category: Category })
          setSelectedArticles([])
        }}
        className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
      />
    </div>
  )
}

export default ArticlesForGroupForm
