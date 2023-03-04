import { useEffect, FormEvent, ChangeEvent } from 'react'
import { debounce } from '../utils/debounce'
import { AiOutlineSearch } from 'react-icons/ai'

type TProps = {
  displayBtn?: boolean
  filter_name: string
  filter: string
  refetch: () => Promise<unknown>
  search: (e: FormEvent) => Promise<void>
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const SearchComponent = ({
  displayBtn,
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
    <form onSubmit={search} className='flex'>
      <input
        autoComplete='off'
        placeholder='Pretraži artikle...'
        name={filter_name}
        value={filter || ''}
        onChange={handleChange}
        className='text-md mx-10 w-full min-w-[450px] rounded-sm p-2 pl-10 outline-none'
      />
      {displayBtn && (
        <button
          disabled={!filter}
          onSubmit={search}
          onClick={search}
          className='flex items-center justify-center rounded-md bg-gray-800 px-3 text-lg font-bold tracking-wide text-white hover:bg-gray-700'
        >
          <AiOutlineSearch className='mr-4 h-6 w-6' /> <p>Pretraži</p>
        </button>
      )}
    </form>
  )
}

export default SearchComponent
