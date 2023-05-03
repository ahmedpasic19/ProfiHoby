import { useState } from 'react'
import { TArticle } from '../../../types/article'
import Article from '../../Article'
import { AiFillCaretLeft } from 'react-icons/ai'

const ArticleCarousel = ({ articles }: { articles: TArticle[] }) => {
  const [xPosition, setXPosition] = useState(0)

  const MAX_LEFT = 0
  // const MAX_RIGHT = 0

  const handleLeft = () => {
    if (xPosition != MAX_LEFT) setXPosition((prev) => prev + 80)
  }
  const handleRight = () => {
    // if (MAX_RIGHT)
    setXPosition((prev) => prev - 80)
  }

  return (
    <div className={`relative flex overflow-hidden px-5 py-2`}>
      <ul
        className='flex gap-4'
        style={{
          transform: `translateX(${xPosition}vw)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
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
      {/* Left and right buttons */}
      <button
        onClick={handleLeft}
        className='from absolute left-0 z-50 h-full bg-gradient-to-b from-gray-400/10 via-gray-800/20 to-gray-400/10 px-2'
      >
        <AiFillCaretLeft className='h-7 w-7 text-gray-800/30' />
      </button>
      <button
        onClick={handleRight}
        className='from absolute right-0 z-50 h-full bg-gradient-to-b from-gray-400/10 via-gray-800/20 to-gray-400/10 px-2'
      >
        <AiFillCaretLeft className='h-7 w-7 rotate-180 text-gray-800/30' />
      </button>
    </div>
  )
}

export default ArticleCarousel
