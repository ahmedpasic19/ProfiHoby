import { Dialog } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Order } from '@prisma/client'
import { trpcClient } from '../../../utils/api'
import Spinner from '../../mics/Spinner'

type TData = Order

type TProps = {
  order_id: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setOrder: React.Dispatch<React.SetStateAction<TData>>
}

const DeleteOrderModal = ({
  order_id,
  isOpen,
  setIsOpen,
  setOrder,
}: TProps) => {
  const onClose = () => {
    setIsOpen(false)
    setOrder({} as TData)
  }

  const queryClient = useQueryClient()

  const { mutate: deleteOrder, isLoading: loadingDelete } = useMutation(
    () => trpcClient.order.deleteOrder.mutate({ id: order_id }),
    {
      onSuccess: async () => {
        onClose()
        await queryClient.invalidateQueries(['order.getAllLockedOrders'])
        await queryClient.invalidateQueries(['order.getAllOrders'])
      },
    }
  )

  const handleDelete = () => deleteOrder()

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className='fixed inset-0'>
        <div
          className='absolute z-30 h-full w-full bg-black/30'
          onClick={onClose}
        />

        <main className='flex h-full min-h-screen w-full flex-col items-center justify-center'>
          <div className='z-30 flex h-full max-h-80 w-full max-w-2xl flex-col items-center justify-evenly rounded-xl bg-white p-4 text-center text-xl font-semibold text-gray-800'>
            <h1 className='w-full text-center text-2xl font-bold text-gray-800'>
              Obriši narudžbu
            </h1>
            <section className='flex w-full justify-evenly'>
              <button
                onClick={handleDelete}
                className='mt-3 flex w-1/4 items-center justify-center rounded-md bg-white p-4 drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)]'
              >
                {loadingDelete ? <Spinner /> : 'Obriši'}
              </button>
              <button
                onClick={onClose}
                className='mt-3 flex w-1/4 items-center justify-center rounded-md bg-white p-4 drop-shadow-[0px_3px_3px_rgba(0,0,0,0.25)]'
              >
                Odustani
              </button>
            </section>
          </div>
        </main>
      </Dialog.Panel>
    </Dialog>
  )
}

export default DeleteOrderModal
