import type { ChangeEvent } from 'react'

type TProps = {
  name: string
  type: string
  label: string
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const FieldSet = ({ name, type, label, value, onChange }: TProps) => {
  return (
    <fieldset className='my-3 flex w-full flex-col items-center'>
      <label
        htmlFor={name}
        className='text-cl mb-2 w-3/4 text-start text-xl font-semibold text-gray-800'
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        placeholder={label}
        onChange={onChange}
        className='w-4/5 rounded-xl border-2 border-gray-800 p-3 outline-none'
      />
    </fieldset>
  )
}

export default FieldSet
