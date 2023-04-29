import { TArticle } from '../../../types/article'
import Article from '../../Article'

const ArticleCarousel = ({ articles }: { articles: TArticle[] }) => {
  return (
    <ul className='flex gap-4 px-5'>
      {articles.map((article) => (
        <li
          key={Math.random()}
          className='flex w-full items-center justify-center'
        >
          <Article
            action={article.article_action_id ? true : false}
            actionPercentage={article?.action?.discount}
            name={article.name}
            imageURL={(article.image[0]?.url as string) || ''}
            price={article.base_price}
            categories={article.categories}
            article_id={article.id}
          />
        </li>
      ))}
    </ul>
  )
}

export default ArticleCarousel
