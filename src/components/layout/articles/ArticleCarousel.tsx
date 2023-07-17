import { TArticle } from '../../../types/article'
import Article from '../../mics/Article'

const ArticleCarousel = ({ articles }: { articles: TArticle[] }) => {
  return (
    <div className='relative flex w-full overflow-hidden px-5 py-2'>
      <ul className='grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:gap-2 xl:grid-cols-4 2xl:grid-cols-6 2xl:gap-2 4k:grid-cols-10'>
        {articles.map((article) => (
          <li
            key={Math.random()}
            className='flex w-full items-center justify-center'
          >
            <Article
              discountPercentage={article?.discountPercentage || 0}
              discountPrice={article?.discountPrice || 0}
              onDiscount={article?.onDiscount || false}
              name={article.name}
              imageURL={article.image[0]?.access_url || ''}
              price={article.base_price}
              categories={article.categories}
              article_id={article.id}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ArticleCarousel
