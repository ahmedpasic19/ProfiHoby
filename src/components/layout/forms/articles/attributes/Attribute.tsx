import { AiFillEdit, AiFillMinusCircle } from 'react-icons/ai'
import EditAttributeForm from './EditAttributeForm'

const Attribute = ({
  selectedAttribute,
  attribute,
  remove,
  edit,
  handleSubmitEdit,
  handleCloseEdit,
}: {
  remove: (id: string) => void
  attribute: {
    title: string
    text: string
    id: string
  }
  selectedAttribute: {
    title: string
    text: string
    id: string
  }
  handleSubmitEdit: (atr: { title: string; text: string; id: string }) => void
  handleCloseEdit: () => void
  edit: (att: { title: string; text: string; id: string }) => void
}) => {
  return (
    <>
      <EditAttributeForm
        isOpen={selectedAttribute.id === attribute.id}
        handleCloseEdit={handleCloseEdit}
        attribute={selectedAttribute}
        handleSubmitEdit={handleSubmitEdit}
      />
      {selectedAttribute.id !== attribute.id && (
        <li className='my-2 flex w-full items-center justify-evenly p-2'>
          <input
            placeholder='Naziv'
            value={attribute.title}
            readOnly
            className='bg-transparent outline-none'
          />
          <input
            placeholder='Opis'
            value={attribute.text}
            readOnly
            className='bg-transparent outline-none'
          />
          <AiFillEdit
            onClick={() => edit(attribute)}
            className='mr-2 h-7 w-7 cursor-pointer text-gray-800 hover:text-gray-600'
          />
          <AiFillMinusCircle
            onClick={() => remove(attribute.id)}
            className='h-7 w-7 cursor-pointer text-gray-800 hover:text-gray-600'
          />
        </li>
      )}
    </>
  )
}

export default Attribute
