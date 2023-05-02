import { CategoriesOnArticle, Category } from '@prisma/client'
import { useRouter } from 'next/router'

import Image from 'next/image'

type TArticleProps = {
  disableLink?: boolean
  action?: boolean
  actionPercentage?: number
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
  action,
  actionPercentage,
}: TArticleProps) => {
  const router = useRouter()

  return (
    <article
      onClick={async () => {
        if (!disableLink) await router.push(`/articles/${article_id}`)
      }}
      className='flex h-48 w-36 cursor-pointer flex-col items-center bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.5)] hover:drop-shadow-[0px_0px_6px_rgba(0,0,0,0.3)] sm:h-80 sm:w-60'
    >
      <section className='relative flex h-3/5 w-full overflow-hidden border-b-[1px] border-r-gray-100'>
        <div className='absolute top-0'>
          <Image
            src={imageURL}
            alt='article image'
            width={150}
            height={100}
            className='h-full w-full object-contain'
          />
        </div>
        {action && (
          <span className='absolute bottom-0 left-0 right-0 h-10 bg-yellow-400 pl-4 text-xl font-semibold text-black'>
            Sniženje {actionPercentage}%
          </span>
        )}
      </section>
      <section className='flex h-2/5 w-full flex-col'>
        <h1 className='h-full w-full text-ellipsis break-words px-2 pt-2 text-sm'>
          {name}
        </h1>
        <h2 className='w-full pr-4 pb-2 text-end text-lg font-bold text-gray-800 sm:text-xl'>
          {price} KM
        </h2>
      </section>
    </article>
  )
}

export default Article
