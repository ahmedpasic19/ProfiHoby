import { CategoriesOnArticle, Category } from '@prisma/client'
import { useRouter } from 'next/router'
import { applyDiscount } from '../../utils/utils'

import Image from 'next/image'

type TArticleProps = {
  disableLink?: boolean
  discountPercentage?: number
  discountPrice?: number
  onDiscount?: boolean
  name: string
  price: number
  imageURL: string
  article_id: string
  categories: (CategoriesOnArticle & { category: Category })[]
}

const Article = ({
  disableLink,
  name,
  price,
  imageURL,
  article_id,
  discountPercentage,
  discountPrice,
  onDiscount,
}: TArticleProps) => {
  const router = useRouter()

  return (
    <article
      onClick={async () => {
        if (!disableLink) await router.push(`/articles/${article_id}`)
      }}
      className='flex h-48 w-full cursor-pointer flex-col items-center bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.5)] hover:drop-shadow-[0px_0px_6px_rgba(0,0,0,0.3)] sm:h-80 sm:w-60'
    >
      <section className='relative flex h-3/5 w-full items-center justify-center overflow-hidden border-b-[1px] border-r-gray-100'>
        <div className='flex items-center justify-center'>
          <Image
            src={imageURL}
            alt='article image'
            // width={150}
            // height={100}
            className='object-contain'
            fill
          />
        </div>
        {onDiscount && (
          // <span className='absolute bottom-0 left-0 right-0 h-10 bg-yellow-400 pl-4 text-xl font-semibold text-black'>
          //   Sniženje
          // </span>
          <span className='absolute left-0 -right-52 top-4 h-10 rotate-45 bg-yellow-400 pl-4 text-center text-xl font-semibold text-black drop-shadow-[0px_2px_2px_rgba(0,0,0,0.25)] sm:top-0'>
            <p className='mr-20 mt-4 sm:mt-2 sm:mr-3'>
              {discountPercentage ? `${discountPercentage}%` : null}
            </p>
          </span>
        )}
      </section>
      <section className='flex h-2/5 w-full flex-col'>
        <h1 className='h- h-full w-full truncate break-words px-2 pt-2 text-sm'>
          {name}
        </h1>
        <h2 className='relative w-full flex-col pr-4 pb-2 text-end text-lg font-bold text-gray-800 sm:text-xl'>
          {onDiscount ? (
            <s className='text-balck text-sm'>
              {price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              KM
            </s>
          ) : (
            <p>
              {price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              KM
            </p>
          )}
          {onDiscount && discountPrice ? (
            <p className='text-red'>
              {discountPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              KM
            </p>
          ) : discountPercentage ? (
            <p className='text-red'>
              {applyDiscount(price, discountPercentage).toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}
              KM
            </p>
          ) : null}
        </h2>
      </section>
    </article>
  )
}

export default Article
