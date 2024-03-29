import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '../../utils/api'

import UnoptimizedImage from '../mics/UnoptimizedImage'
import * as Ai from 'react-icons/ai'
import { Image as ImageModel } from '@prisma/client'

type TProps = {
  images: ImageModel[]
  isDelete?: boolean
  article_id?: string
  action_id?: string
}

const ImageGrid = ({ images, article_id, action_id, isDelete }: TProps) => {
  const queryClient = useQueryClient()

  const { mutate: deleteImageMutation } = useMutation(
    (input: { key: string; id: string }) =>
      trpcClient.image.deleteImage.mutate(input),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'image.getAllRelatedImages',
          { article_id, action_id },
        ])
      },
      onError: async () => {
        await queryClient.invalidateQueries([
          'image.getAllRelatedImages',
          { article_id, action_id },
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
          <UnoptimizedImage
            src={image.access_url || ''}
            width={300}
            height={200}
            alt='article image'
          />
          {isDelete && (
            <Ai.AiFillCloseCircle
              onClick={() =>
                deleteImageMutation({ id: image.id, key: image.key })
              }
              className='absolute top-2 right-2 h-8 w-8 cursor-pointer text-red-500 hover:text-red-600'
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
