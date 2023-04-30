import { useEffect, FormEvent, ChangeEvent } from 'react'
import { debounce } from '../utils/debounce'

type TProps = {
  displayBtn?: boolean
  filter_name: string
  filter: string
  refetch: () => Promise<unknown>
  search?: (e: FormEvent) => Promise<void>
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const SearchComponent = ({
  filter_name,
  filter,
  refetch,
  search,
  handleChange,
}: TProps) => {
  useEffect(() => {
    const trigger = async () => {
      await refetch()
    }

    debounce(trigger, 1000)
  }, [filter, refetch])

  return (
    <form onSubmit={search} className='flex w-full p-2 sm:max-w-[15em]'>
      <input
        autoComplete='off'
        placeholder='Pretraži artikle...'
        name={filter_name}
        value={filter || ''}
        onChange={handleChange}
        className='sm:text-md w-full min-w-[5em] rounded-sm p-2 pl-3 text-lg outline-none'
      />
    </form>
  )
}

export default SearchComponent
