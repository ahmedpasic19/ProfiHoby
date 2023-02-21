import { useRouter } from 'next/router'
import { api } from '../../utils/api'

const ArticlePage = () => {
  const router = useRouter()
  const { article_id } = router.query

  const { data: article } = api.article.getArticle.useQuery(
    { id: article_id as string },
    {
      enabled: article_id ? true : false,
    }
  )

  const { data: artilce_images } = api.image.getAllArticleImages.useQuery(
    {
      id: article_id as string,
    },
    {
      enabled: article_id ? true : false,
    }
  )

  return <div>ArticlePage</div>
}

export default ArticlePage
