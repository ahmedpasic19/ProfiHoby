import { useState } from 'react'
import { AiFillCheckSquare, AiFillCloseSquare } from 'react-icons/ai'

const EditAttributeForm = ({
  isOpen,
  attribute,
  handleSubmitEdit,
  handleCloseEdit,
}: {
  isOpen: boolean
  attribute: { title: string; text: string; id: string }
  handleSubmitEdit: (atr: { title: string; text: string; id: string }) => void
  handleCloseEdit: () => void
}) => {
  const [newAttribute, setNewAttribute] = useState(attribute)

  return (
    <div
      className={`${
        isOpen ? 'block' : 'hidden'
      } relative my-2 flex w-full flex-col items-center justify-evenly p-2`}
    >
      <div className='flex w-full items-center justify-end'>
        <button onClick={() => handleSubmitEdit(newAttribute)}>
          <AiFillCheckSquare className='  bottom-2 h-7 w-7 text-gray-800 hover:text-gray-600' />
        </button>
        <button onClick={handleCloseEdit}>
          <AiFillCloseSquare className='  bottom-2 h-7 w-7 text-gray-800 hover:text-gray-600' />
        </button>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className='flex w-full items-center'
      >
        <fieldset>
          <label className='font-semibold text-gray-800'>Naziv</label>
          <input
            placeholder='Naziv'
            value={newAttribute.title || ''}
            name='title'
            className='rounded-sm border-2 border-gray-400 pl-2 outline-none'
            onChange={(e) =>
              setNewAttribute((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </fieldset>
        <fieldset>
          <label className='font-semibold text-gray-800'>Opis</label>
          <input
            placeholder='Opis'
            value={newAttribute.text || ''}
            name='text'
            onChange={(e) =>
              setNewAttribute((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
            className='rounded-sm border-2 border-gray-400 pl-2 outline-none'
          />
        </fieldset>
      </form>
    </div>
  )
}

export default EditAttributeForm
