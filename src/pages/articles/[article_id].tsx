import { useRouter } from 'next/router'
import { trpcClient } from '../../utils/api'
import { useQuery } from '@tanstack/react-query'

import ImageCarousel from '../../components/layout/ImageCarousel'
import Image from 'next/image'

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

  const image_uls = artilce_images?.map((image) => image.access_url || '') || []

  const apiString = `${article?.description || ''}`
  const formattedString = apiString.replace(/&lt;br&gt;/g, '<br/>')

  return (
    <div className='flex h-full min-h-screen w-full flex-col'>
      <div className='flex w-full flex-col items-center'>
        {/* Images and detail */}
        <section className='flex flex-col sm:flex-row'>
          <div className='inset-0 flex w-full flex-col items-center justify-center overflow-hidden rounded-sm border-2 border-gray-100 sm:max-w-[50%]'>
            {/* Selected image preveiw */}
            <div className='flex h-96 w-96 items-center justify-center overflow-hidden'>
              <ImageCarousel images={image_uls} />
            </div>
            {/* List of all article images */}
            <div className='mt-5 flex w-full gap-2 overflow-x-auto bg-white shadow-md'>
              {image_uls?.map((image) => (
                <div
                  key={Math.random().toString()}
                  className='flex h-28 w-28 items-center justify-center overflow-hidden'
                >
                  <Image
                    alt='article image'
                    src={image}
                    width={300}
                    height={300}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='jucenter flex h-full w-full flex-col items-center sm:max-w-[50%]'>
            <h2 className='w-full bg-gray-600 p-5 text-center text-2xl font-semibold text-white'>
              {article?.name}
            </h2>
            <h1 className='p-10 text-[4em] font-extrabold tracking-tight text-gray-600'>
              {article?.base_price}KM
            </h1>
          </div>
        </section>

        {/* Article description */}
        <section className='flex w-full max-w-[80%] flex-col items-center'>
          <h2 className='text-xl font-bold'>Opis artikla</h2>
          <div dangerouslySetInnerHTML={{ __html: formattedString }} />
        </section>
      </div>
    </div>
  )
}

export default ArticlePage
