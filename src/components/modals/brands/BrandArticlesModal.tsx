import { Dialog } from '@headlessui/react'
import { Brand } from '@prisma/client'
import ArticlesForBrandForm from '../../layout/forms/brands/ArticlesForBrandForm'

type TProps = {
  brand: Brand
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setBrand: React.Dispatch<React.SetStateAction<Brand>>
}

const BrandArticlesModal = ({ brand, isOpen, setIsOpen, setBrand }: TProps) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className='fixed inset-0 flex items-center justify-center'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
          }}
        />
        <main className='flex h-full min-h-screen w-1/3 flex-col items-center justify-center'>
          <ArticlesForBrandForm
            brandArticles
            brand={brand}
            setIsOpen={setIsOpen}
            setBrand={setBrand}
          />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default BrandArticlesModal
