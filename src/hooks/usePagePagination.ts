import { useEffect, useState } from 'react'

const usePagePagination = (length: number) => {
  const [pageArr, setPageArr] = useState<number[]>([])
  useEffect(() => {
    function createPageArray(len: number) {
      const arr = []
      for (let i = 0; i < len; i++) {
        arr.push(i + 1)
      }
      return arr
    }

    const arr = createPageArray(length)

    setPageArr(arr)
  }, [length])

  return pageArr
}

export default usePagePagination
