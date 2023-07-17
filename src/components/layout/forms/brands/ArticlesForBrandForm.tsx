import { useState, useMemo, FormEvent, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../../../utils/api'
import {
  Brand,
  Article as ArticleModel,
  CategoriesOnArticle,
  Image,
  Category,
} from '@prisma/client'

import SearchComponent from '../../../mics/SearchComponent'
import FormButton from '../../../mics/FormButton'
import Article from '../../../mics/Article'

import { ImCheckboxChecked } from 'react-icons/im'
import { AiFillCloseCircle } from 'react-icons/ai'

type TProps = {
  brandArticles?: boolean
  brand: Brand
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPageIndex?: React.Dispatch<React.SetStateAction<number>>
  setBrand: React.Dispatch<React.SetStateAction<Brand>>
}

type TArticle = ArticleModel & {
  image: Image[]
  categories: (CategoriesOnArticle & {
    category: Category
  })[]
}

const ArticlesForBrandForm = ({
  brandArticles,
  brand,
  setIsOpen,
  setPageIndex,
  setBrand,
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

  const { data: brand_articles } = useQuery(
    [
      'article.getArticlesByBrandID',
      { id: brand.id },
      'article.getArticlesByBrandID',
    ],
    () => trpcClient.article.getArticlesByBrandID.query({ id: brand.id }),
    {
      enabled: brandArticles,
    }
  )

  // Assign new articles to a brand
  const { mutate: updateBrand, isLoading: loadingCreate } = useMutation(
    (input: {
      id: string
      name: string
      article_ids: string[]
      group_id: string
    }) => trpcClient.brand.updateBrand.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['brand.getAllBrands'])
        await queryClient.invalidateQueries(['article.getArticle'])
        await queryClient.invalidateQueries([
          'article.getArticlesByBrandID',
          { id: brand.id },
        ])
        setIsOpen(false)
        setPageIndex && setPageIndex(0)
        setBrand({} as Brand)
        setSelectedArticles([])
      },
    }
  )

  // On load set already related articles to state
  useEffect(() => {
    setSelectedArticles(brand_articles || [])
  }, [brand_articles])

  const data = useMemo(() => articles, [articles])

  const handleSelectArticle = (article: TArticle) => {
    const selected = selectedArticles.find((art) => article.id === art.id)

    // Remove if already selected
    if (selected) {
      const new_articles = selectedArticles.filter(
        (art) => art.id !== article.id
      )
      setSelectedArticles(new_articles)
    }
    // Add if not selected
    else setSelectedArticles((prev) => [...prev, article])
  }

  const handleAddArticles = (e: FormEvent) => {
    e.preventDefault()
    const article_ids = selectedArticles.map((art) => art.id)

    // Relate articles the brand
    updateBrand({
      id: brand.id,
      name: brand.name,
      article_ids,
      group_id: brand.group_id || '',
    })
  }

  return (
    <div className='relative z-10 w-full rounded-xl bg-white p-10'>
      <h1 className='mb-10 w-full text-center text-2xl font-bold text-gray-800'>
        Odaberi artikle
      </h1>
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
            text={brand_articles?.length ? 'Izmjeni' : 'Dodaj'}
          />
        </section>
      </form>

      <AiFillCloseCircle
        onClick={() => {
          setIsOpen(false)
          setBrand({} as Brand)
          setSelectedArticles([])
        }}
        className='absolute top-4 right-4 h-8 w-8 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-800'
      />
    </div>
  )
}

export default ArticlesForBrandForm
