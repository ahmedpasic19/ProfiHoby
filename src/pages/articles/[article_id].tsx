import { useState } from 'react'
import { useRouter } from 'next/router'
import { trpcClient } from '../../utils/api'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import ImageCarousel from '../../components/layout/ImageCarousel'
import UnoptimizedImage from '../../components/mics/UnoptimizedImage'
import Article from '../../components/mics/Article'
import Counter from '../../components/mics/Counter'
import AddToCart from '../../components/modals/cart/AddToCart'
import { AiOutlineDropbox, AiOutlineShoppingCart } from 'react-icons/ai'

import { parseTextFormat, reverseFormatContent } from '../../utils/formatText'
import { applyDiscount } from '../../utils/utils'

import OLXLogo from '../../assets/olx_logo.png'

import Pixel from '../../components/Pixel'

const ArticlePage = () => {
  const [openCart, setOpenCart] = useState(false)
  const [count, setCount] = useState(1)

  const router = useRouter()
  const { article_id } = router.query

  const articleId = typeof article_id === 'string' ? article_id : ''

  const { data: article } = useQuery(['article', { id: article_id }], () =>
    trpcClient.article.getArticle.query({ article_id: articleId })
  )

  const { data: groupArticles } = useQuery(
    [
      'article.getArticlesByGroupID',
      { group_id: article?.groups[0]?.group_id },
    ],
    () =>
      trpcClient.article.getArticlesByGroupID.query({
        group_id: article?.groups[0]?.group_id || '',
        pageIndex: 1,
        pageSize: 12,
      }),
    {
      enabled: article?.groups[0]?.group_id ? true : false,
    }
  )

  const { data: artilce_images } = useQuery(
    ['image.getAllArticleImges', { article_id: articleId }],
    () =>
      trpcClient.image.getAllRelatedImages.query({
        article_id: articleId,
      }),
    {
      enabled: articleId ? true : false,
    }
  )

  const image_uls = artilce_images?.map((image) => image.access_url || '') || []

  const apiString = `${article?.description || ''}`
  const formattedString = apiString.replace(/&lt;br&gt;/g, '<br/>')

  const descriptionValues = reverseFormatContent(article?.description || '')

  const copyToClipboard = async () => {
    await navigator?.clipboard.writeText('+387 62 671 327')
    toast.info('Kopiran br. telefona', {
      position: 'top-center',
      hideProgressBar: true,
      delay: 500,
    })
  }

  // Price article by the amount of one is sold for
  // This account for any discount
  const sellingPrice = article?.discountPrice
    ? article?.discountPrice
    : article?.discountPercentage
    ? applyDiscount(article?.base_price, article?.discountPercentage)
    : article?.base_price || 0

  return (
    <>
      <Pixel name='FACEBOOK_PIXEL_1' />

      <div className='flex w-full items-center justify-center'>
        <div className='flex h-full min-h-screen w-full flex-col pb-5 xl:w-4/5'>
          <div className='flex w-full flex-col items-center'>
            {/* Images and detail */}
            <section className='flex w-full flex-col bg-gray-50 sm:flex-row'>
              <div className='inset-0 flex w-full flex-col items-center justify-center overflow-hidden bg-white sm:max-w-[50%]'>
                {/* Selected image preveiw */}
                <div className='flex h-96 w-full items-center justify-center overflow-hidden'>
                  <ImageCarousel images={image_uls} />
                </div>
                {/* List of all article images */}
                <div className='mt-5 flex w-full gap-2 overflow-x-auto bg-white px-5 shadow-md sm:px-0'>
                  {image_uls?.map((image) => (
                    <div
                      key={Math.random().toString()}
                      className='flex h-28 w-28 items-center justify-center overflow-hidden'
                    >
import UnoptimizedImage
                        unoptimized
                        alt='article image'
                        src={image}
                        width={300}
                        height={300}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Name & price section */}
              <div className='jucenter flex h-full w-full flex-col items-center p-5 sm:max-w-[50%]'>
                <h2 className='mb-2 w-full border-b-2 border-gray-200 pb-2 text-start text-2xl uppercase text-black/80'>
                  {article?.name}
                </h2>
                <div className='flex w-full flex-col justify-evenly border-b-2 border-gray-200 pb-2'>
                  <span className='flex'>
                    <label className='font-semibold'>Rok isporuke:</label>
                    <p className='ml-2'>1-2 dana</p>
                  </span>
                  {article?.warranty && (
                    <span className='flex'>
                      <label className='font-semibold'>Garancija:</label>
                      <p className='ml-2'>{article?.warranty}</p>
                    </span>
                  )}
                </div>

                {/* article price */}
                <h1 className='w-full border-b-2 border-gray-200 pb-2 text-start text-4xl font-extrabold tracking-tight text-gray-600'>
                  {article?.onDiscount ? (
                    <s className='text-[0.6em] font-semibold text-gray-600'>
                      {article?.base_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {'  '} KM
                    </s>
                  ) : (
                    <p>
                      {article?.base_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {'  '} KM
                    </p>
                  )}
                  {article?.onDiscount && article?.discountPrice ? (
                    <p className='flex text-gray-800'>
                      {article?.discountPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {'  '} <p className='ml-4 text-main'>KM</p>
                    </p>
                  ) : article?.discountPercentage ? (
                    <p>
                      {applyDiscount(
                        article?.base_price,
                        article?.discountPercentage
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      {'  '} KM
                    </p>
                  ) : null}
                </h1>

                {/* Order section */}
                <section className='mt-4 flex h-full w-full flex-col items-center border-b-2 border-gray-200 pb-5 sm:flex-row sm:items-end'>
                  <Counter count={count} setCount={setCount} />
                  <button
                    onClick={() => setOpenCart(true)}
                    className='my-2 flex w-full cursor-pointer justify-evenly rounded-md bg-main p-2 text-center text-lg font-bold text-white sm:mx-2 sm:w-3/5'
                  >
                    <AiOutlineShoppingCart className='h-8 w-8 cursor-pointer' />
                    <label className='cursor-pointer'>Dodaj</label>
                  </button>
                  <button
                    onClick={() => setOpenCart(true)}
                    className='my-2 flex w-full cursor-pointer justify-evenly rounded-md bg-gray-800 p-2 text-center text-lg font-bold text-white sm:mx-2 sm:w-3/5'
                  >
                    <AiOutlineDropbox className='h-8 w-8 cursor-pointer' />
                    <label className='cursor-pointer'>Naruči</label>
                  </button>
                </section>

                <section
                  onClick={copyToClipboard}
                  className='mt-5 flex h-full w-full items-center justify-evenly rounded-sm border-2 border-gray-100 bg-white p-2'
                >
                  <span className='w-full'>
                    <h1 className='w-full text-center text-lg font-bold text-main'>
                      Nazovi i naruči
                    </h1>
                    <p className='w-full text-center text-base font-semibold text-gray-800'>
                      +387 62 671 327
                    </p>
                  </span>
                  <span>
                    <p className='text-xs'>
                      Imate li pitanje u vezi ovog proizvoda? Tu smo za Vas.
                      Provjerite dostupnost ovog proizvoda u našoj trgovini ili
                      saznajte dodatne informacije pozivom ili porukom na broj.
                    </p>
                  </span>
                </section>

                <section className='mt-5 flex w-full items-center'>
import UnoptimizedImage
                    height={50}
                    width={50}
                    alt='OLX logo'
                    src={OLXLogo}
                    className='mr-4 rounded-full'
                  />
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href='https://profihoby.olx.ba/aktivni'
                    className='text-lg font-bold text-main underline underline-offset-1'
                  >
                    Pronađite nas na OLX-u
                  </a>
                </section>
              </div>
            </section>

            <div className='w-full px-5 sm:px-0 lg:px-20 xl:px-0'>
              {/* Article short description */}
              <section className='mt-4 flex w-full flex-col items-center'>
                {' '}
                <h2 className='mb-4 w-full text-start text-2xl font-bold uppercase text-main'>
                  Opis proizvoda
                </h2>
                <p className='w-full whitespace-pre-line break-words text-base font-normal text-gray-600'>
                  {parseTextFormat(article?.short_description || '')}
                </p>
              </section>

              {/* Article description */}
              <section className='mt-4 flex w-full flex-col items-center'>
                <h2 className='mb-4 w-full text-start text-2xl font-bold uppercase text-main'>
                  Tehničke informacije
                </h2>
                {article?.description?.includes('&lt;br&gt;') ? (
                  <div dangerouslySetInnerHTML={{ __html: formattedString }} />
                ) : (
                  descriptionValues?.map((att) => (
                    <li
                      key={Math.random()}
                      className='flex w-full justify-between'
                    >
                      <label className='w-full text-lg font-bold text-gray-800'>
                        {att.title}
                      </label>
                      <p className='w-full max-w-5xl truncate whitespace-pre-line text-end text-lg text-gray-600'>
                        {att.value}
                      </p>
                    </li>
                  ))
                )}
              </section>

              {article?.attributes?.length ? (
                <section className='mt-2 w-full sm:w-4/5'>
                  <ul className='w-full px-4'>
                    {article?.attributes?.map((att) => (
                      <li
                        key={Math.random()}
                        className='flex w-full justify-between'
                      >
                        <label className='w-full text-lg font-bold text-gray-800'>
                          {att.title}
                        </label>
                        <p className='w-full max-w-5xl truncate whitespace-pre-line text-end text-lg text-gray-600'>
                          {att.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {/* Articles from the same group */}
            {groupArticles?.group?.articles.length ? (
              <section className='h-screen w-full py-10 lg:px-20 xl:px-0'>
                <header className='mb-4 flex w-full pl-4 text-start text-2xl uppercase text-gray-800 sm:pl-0'>
                  <p> JOŠ ARTIKALA IZ KATEGORIJE:</p>{' '}
                  <p className='ml-4 font-bold text-main'>
                    {groupArticles?.group?.name}
                  </p>
                </header>

                <div className='article_grid_layout'>
                  {groupArticles?.group?.articles.map((article) => {
                    return (
                      <li
                        key={Math.random()}
                        className='flex w-full items-center justify-center'
                      >
                        <Article
                          discountPercentage={
                            article.article.discountPercentage || 0
                          }
                          discountPrice={article.article.discountPrice || 0}
                          onDiscount={article.article.onDiscount || false}
                          categories={article.article.categories}
                          imageURL={
                            //@ts-ignore // Error: "url doesn't exits on image", but it does exits
                            (article.article.image[0]?.access_url as string) ||
                            ''
                          }
                          price={article.article.base_price}
                          article_id={article.article_id}
                          name={article.article.name}
                        />
                      </li>
                    )
                  })}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
      <AddToCart
        amount={count}
        isOpen={openCart}
        setIsOpen={setOpenCart}
        basePrice={article?.base_price || 0}
        articleId={article?.id || ''}
        articleName={article?.name || ''}
        onDiscount={article?.onDiscount || false}
        image={artilce_images?.at(0)?.access_url || ''}
        sellingPrice={sellingPrice}
      />
    </>
  )
}

export default ArticlePage
