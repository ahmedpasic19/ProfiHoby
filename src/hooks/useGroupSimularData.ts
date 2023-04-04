import { useEffect, useState } from 'react'

import stringSimilarity from 'string-similarity'

const useGroupSimularData = <T>({
  data,
  treshHold,
  groupBy,
}: {
  data: T[]
  treshHold: number
  groupBy: Extract<keyof T, string>
}) => {
  const [groupedData, setGroupedData] = useState<T[]>([])

  useEffect(() => {
    const groups = data.reduce((result: { [key: string]: T[] }, obj) => {
      // Check if the current article_name is similar to any existing group
      const similarGroup = Object.keys(result).find((key: string) => {
        const similarity = stringSimilarity.compareTwoStrings(
          key,
          obj[groupBy] as string
        )
        return similarity > treshHold
      })

      // If the current obj is similar to an existing group, add it to that group
      if (similarGroup) {
        result[similarGroup]?.push(obj)
      } else {
        // Otherwise, create a new group for the current obj
        result[obj[groupBy] as string] = [obj]
      }

      return result
    }, {})

    // Get the minimum set of article by taking the first string of each group
    const minimum = Object.values(groups)
      .map((group: T[]) => group[0])
      .filter(Boolean)

    setGroupedData(minimum)
  }, [data, groupBy, treshHold])

  return groupedData
}

export default useGroupSimularData
