interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  label?: string
  htmlFor?: string
}

const Textarea = ({ label, htmlFor, ...props }: TextAreaProps) => {
  return (
    <fieldset className='my-3 flex w-full flex-col items-center'>
      {label && (
        <label
          htmlFor={htmlFor || ''}
          className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'
        >
          {label}
        </label>
      )}
      <textarea
        {...props}
        className='block w-4/5 rounded-lg border-2 border-gray-800 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
      ></textarea>
    </fieldset>
  )
}

export default Textarea
