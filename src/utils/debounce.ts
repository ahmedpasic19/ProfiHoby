/* eslint-disable*/

type DebouncedFunction<F extends (...args: any[]) => any> = (
  ...args: Parameters<F>
) => void

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): DebouncedFunction<F> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  return function (this: any, ...args: Parameters<F>) {
    const context = this
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(context, args), delay)
  }
}
