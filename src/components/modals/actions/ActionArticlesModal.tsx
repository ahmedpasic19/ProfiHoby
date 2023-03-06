import { Dialog } from '@headlessui/react'
import React from 'react'
import ArticlesForActionForm from '../../layout/actions/ArticlesForActionForm'

type TProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ActionArticlesModal = ({ isOpen, setIsOpen }: TProps) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute h-full w-full bg-black/30'
          onClick={() => {
            setIsOpen(false)
          }}
        />
        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <ArticlesForActionForm />
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default ActionArticlesModal
