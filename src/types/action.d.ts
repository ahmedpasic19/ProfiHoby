// ArticleAction with S3 image URL
export type TActionWithImage = {
  image: {
    url: string
    id: string
    name: string
    image: string
    article_id: string | null
    action_id: string | null
    userId: string | null
  }[]
  id: string
  discount: number
  title: string
  date: Date | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}
