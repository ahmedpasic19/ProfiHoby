export const formatTextContent = (text: string) => {
  // Replace '  ' with [sp]
  let formattedText = text.replace(/ {2}/g, '[sp]')

  // Replace '\n' with [nl]
  formattedText = formattedText.replace(/\n/g, '[nl]')

  // Replace '\t' with [tab]
  formattedText = formattedText.replace(/\t/g, '[tab]')

  return formattedText
}

interface DataItem {
  title: string
  value: string
}

export const parseTextFormat = (formattedText: string) => {
  // Replace [sp] with a space
  let reversedText = formattedText.replace(/\[sp]/g, ' ')

  // Replace [nl] with '\n'
  reversedText = reversedText.replace(/\[nl]/g, '\n')

  // Replace [tab] with '\t'
  reversedText = reversedText.replace(/\[tab]/g, '\t')

  return reversedText
}

export const reverseFormatContent = (formattedText: string): DataItem[] => {
  const reversedText = formattedText
    .replace(/\[sp]/g, ' ')
    .replace(/\[nl]/g, '\n')
    .replace(/\[tab]/g, '\t')

  const lines: string[] = reversedText.split('\n')
  const dataArray: DataItem[] = lines.map((line) => {
    const [title = '', value = ''] = line.split('\t')
    return { title, value }
  })

  return dataArray
}
