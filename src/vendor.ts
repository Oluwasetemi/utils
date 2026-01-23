import { debounce as _debounce, throttle as _throttle } from 'throttle-debounce'

/**
 * Options for canceling a throttled or debounced function.
 *
 * @category Vendor
 */
interface CancelOptions {
  upcomingOnly?: boolean
}

/**
 * A function type that includes a cancel method.
 *
 * @category Vendor
 * @template T - The original function type
 */
interface ReturnWithCancel<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: (options?: CancelOptions) => void
}

/**
 * Creates a throttled function that only invokes the provided function at most once per specified delay.
 *
 * Useful for rate-limiting execution of handlers on events like resize and scroll.
 *
 * @category Vendor
 * @template T - The function type to throttle
 * @param delay - The number of milliseconds to throttle invocations to
 * @param callback - The function to throttle
 * @param options - Optional configuration (noTrailing, noLeading, debounceMode)
 * @returns A throttled function with a cancel method
 * @example
 * ```ts
 * const throttledScroll = throttle(100, () => {
 *   console.log('Scroll event')
 * })
 * window.addEventListener('scroll', throttledScroll)
 *
 * // Cancel future invocations
 * throttledScroll.cancel()
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(...args: any[]): ReturnWithCancel<T> {
  // @ts-expect-error
  return _throttle(...args)
}

/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified delay has elapsed since the last time the debounced function was invoked.
 *
 * Useful for implementing behavior that should only happen after repeated actions have completed.
 *
 * @category Vendor
 * @template T - The function type to debounce
 * @param delay - The number of milliseconds to delay
 * @param callback - The function to debounce
 * @param options - Optional configuration (atBegin)
 * @returns A debounced function with a cancel method
 * @example
 * ```ts
 * const debouncedSearch = debounce(300, (query: string) => {
 *   fetchSearchResults(query)
 * })
 * input.addEventListener('input', (e) => debouncedSearch(e.target.value))
 *
 * // Cancel pending invocation
 * debouncedSearch.cancel()
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(...args: any[]): ReturnWithCancel<T> {
  // @ts-expect-error
  return _debounce(...args)
}
