import Spinner from './Spinner'

interface FormButton extends React.ComponentPropsWithoutRef<'button'> {
  text: string
  isLoading: boolean
}

const FormButton = ({ text, isLoading, ...props }: FormButton) => {
  return (
    <button
      {...props}
      className='flex w-4/5 items-center justify-center rounded-xl bg-gray-800 p-4 text-center text-xl font-semibold text-gray-300 hover:bg-gray-700 disabled:bg-gray-600'
    >
      {isLoading ? <Spinner /> : text}
    </button>
  )
}

export default FormButton
