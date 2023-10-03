import Image from 'next/image'

const UnoptimizedImage = (props: any) => {
  return <Image {...props} unoptimized loading='lazy' />
}

export default UnoptimizedImage
