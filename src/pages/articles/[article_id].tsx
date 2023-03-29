import { useRouter } from 'next/router'
import { trpcClient } from '../../utils/api'
import { useQuery } from '@tanstack/react-query'

import ImageCarousel from '../../components/layout/ImageCarousel'
import Textarea from '../../components/Textarea'

const ArticlePage = () => {
  const router = useRouter()
  const { article_id } = router.query

  const articleId = typeof article_id === 'string' ? article_id : ''

  const { data: article } = useQuery(['article', { id: article_id }], () =>
    trpcClient.article.getArticle.query({ article_id: articleId })
  )

  const { data: artilce_images } = useQuery(
    ['image.getAllArticleImges', { article_id: articleId, action_id: null }],
    () =>
      trpcClient.image.getAllRelatedImages.query({
        article_id: articleId,
        action_id: null,
      }),
    {
      enabled: articleId ? true : false,
    }
  )

  const image_uls = artilce_images?.map((image) => image.url) || []

  return (
    <div className='flex h-full min-h-screen w-full flex-col items-center justify-center bg-gray-200'>
      <div className='flex w-[600px] flex-col items-center justify-center bg-white p-10'>
        <section className='mb-5 flex w-full items-center justify-center'>
          <h2 className='w-full text-start text-2xl font-semibold text-gray-800'>
            {article?.name}
          </h2>
          <h1 className='w-full text-start text-2xl font-bold text-gray-800'>
            {article?.base_price}KM
          </h1>
        </section>
        <ImageCarousel images={image_uls} />
        <section className='mt-5 flex w-full flex-col'>
          <div className='mt-2 grid grid-cols-2 grid-rows-2 gap-2'>
            {article?.categories?.map((category) => {
              return (
                <Category
                  key={Math.random().toString()}
                  name={category.category.name}
                />
              )
            })}
          </div>
        </section>
        <section className='mt-5 flex w-full flex-col items-center'>
          <h3 className='w-full text-start text-lg font-semibold text-gray-800'>
            Detaljan opis
          </h3>
          <Textarea cols={30} rows={10} value={article?.description} readOnly />
        </section>
      </div>
    </div>
  )
}

export default ArticlePage

const Category = ({ name }: { name: string }) => {
  return (
    <div className='h-6 w-[100px] truncate rounded-sm bg-gray-200 px-2 text-sm text-gray-800 drop-shadow-[0px_0px_1px]'>
      {name}
    </div>
  )
}
