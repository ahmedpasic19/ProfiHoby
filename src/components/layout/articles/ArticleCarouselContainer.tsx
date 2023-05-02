import { TArticle } from '../../../types/article'
import ArticleCarousel from './ArticleCarousel'

const ArticleCarouselContainer = ({
  group_name,
  articles,
}: {
  group_name: string
  articles: TArticle[]
}) => {
  return (
    <div className='mb-14 flex w-full flex-col bg-white pt-4 drop-shadow-2xl'>
      <label className='pl-5 pb-4 text-2xl font-bold tracking-tight'>
        {group_name}
      </label>
      <ArticleCarousel articles={articles} />
    </div>
  )
}

export default ArticleCarouselContainer
