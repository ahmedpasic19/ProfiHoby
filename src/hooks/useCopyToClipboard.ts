const useCopyToClipboard = () => {
  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .catch((error) => console.error('Failed to copy to clipboard', error))
  }

  return copyToClipboard
}

export default useCopyToClipboard
