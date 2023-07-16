import React from 'react'

type TProps = {
  count: number
  setCount: React.Dispatch<React.SetStateAction<number>>
}

const Counter = ({ count, setCount }: TProps) => {
  return (
    <div className='bg white flex w-full select-none justify-between rounded-md border-2 border-gray-200 p-4 sm:max-w-[10rem]'>
      <button
        className='h-full text-2xl font-bold text-gray-800'
        onClick={() => setCount((prev) => (prev != 1 ? prev - 1 : 1))}
      >
        -
      </button>
      <span className='text-2xl font-bold text-gray-800'>{count}</span>
      <button
        className='h-full text-2xl font-bold text-gray-800'
        onClick={() => setCount((prev) => prev + 1)}
      >
        +
      </button>
    </div>
  )
}

export default Counter
