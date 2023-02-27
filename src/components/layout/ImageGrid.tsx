import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import Image from 'next/image'
import * as Ai from 'react-icons/ai'

type TProps = {
  images: {
    url: string
    id: string
    name: string
    image: string
    article_id: string | null
    userId: string | null
  }[]
  isDelete?: boolean
  articleId?: string
}

const ImageGrid = ({ images, articleId, isDelete }: TProps) => {
  const queryClient = useQueryClient()

  const { mutate: deleteImage } = useMutation(
    (input: { key: string; id: string }) =>
      trpcClient.image.deleteArticleImage.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'image.getAllArricleImages',
          { id: articleId },
        ])
      },
      onError: async () => {
        await queryClient.invalidateQueries([
          'image.getAllArricleImages',
          { id: articleId },
        ])
      },
    }
  )

  return (
    <div className='grid grid-cols-4 grid-rows-2 gap-4'>
      {images?.map((image) => (
        <div
          key={Math.random().toString()}
          className='relative flex h-full w-full items-center justify-center'
        >
          <Image src={image.url} width={300} height={200} alt='article image' />
          {isDelete && (
            <Ai.AiFillCloseCircle
              onClick={() => deleteImage({ id: image.id, key: image.image })}
              className='absolute top-2 right-2 h-8 w-8 cursor-pointer text-red-500 hover:text-red-600'
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
