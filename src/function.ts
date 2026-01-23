import type { Fn, Nullable } from './types'

/**
 * Call every function in an array.
 *
 * Skips null/undefined functions safely.
 *
 * @category Function
 * @param functions - Array of functions to invoke
 * @returns void
 * @example
 * ```ts
 * const cleanup1 = () => console.log('cleanup 1')
 * const cleanup2 = () => console.log('cleanup 2')
 * batchInvoke([cleanup1, null, cleanup2])
 * // Logs: 'cleanup 1', 'cleanup 2'
 * ```
 */
export function batchInvoke(functions: Nullable<Fn>[]) {
  functions.forEach(fn => fn && fn())
}

/**
 * Call a function and return its result.
 *
 * Useful for creating IIFEs (Immediately Invoked Function Expressions) inline.
 *
 * @category Function
 * @param fn - The function to invoke
 * @returns The return value of the function
 * @example
 * ```ts
 * const result = invoke(() => {
 *   const a = 1
 *   const b = 2
 *   return a + b
 * }) // 3
 * ```
 */
export function invoke<T>(fn: () => T): T {
  return fn()
}

/**
 * Pass a value through a callback and return the value.
 *
 * Useful for performing side effects while preserving the value in a chain.
 *
 * @category Function
 * @param value - The value to pass through
 * @param callback - The function to call with the value
 * @returns The original value
 * @example
 * ```ts
 * function createUser(name: string): User {
 *   return tap(new User(), user => {
 *     user.name = name
 *   })
 * }
 *
 * // Or for debugging in chains
 * const result = someArray
 *   .map(x => x * 2)
 *   .map(tap(n => console.log('Doubled value:', n)))
 *   .filter(n => n > 5)
 * ```
 */
export function tap<T>(value: T, callback: (value: T) => void): T {
  callback(value)
  return value
}
