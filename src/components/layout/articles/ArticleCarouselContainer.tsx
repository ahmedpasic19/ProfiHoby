import Link from 'next/link'
import ArticleCarousel from './ArticleCarousel'
import { TArticle } from '../../../types/article'

type TProps = {
  group_name: string
  articles: TArticle[]
  group_id: string
}

const ArticleCarouselContainer = ({
  group_name,
  articles,
  group_id,
}: TProps) => {
  return (
    <div className='mb-5 flex w-full flex-col bg-white pt-4 drop-shadow-[0_1px_5px_rgba(0,0,0,0.25)]'>
      <Link
        href={`/groups/${group_id}`}
        className='pl-5 pb-4 text-2xl font-bold tracking-tight underline underline-offset-2'
      >
        {group_name}
      </Link>
      <ArticleCarousel articles={articles} />
    </div>
  )
}

export default ArticleCarouselContainer
