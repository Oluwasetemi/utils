import type { Fn } from './types'
import { remove } from './array'

/**
 * Return type for createSingletonPromise.
 *
 * @category Promise
 */
export interface SingletonPromiseReturn<T> {
  (): Promise<T>
  /**
   * Reset current staled promise.
   * Await it to have proper shutdown.
   */
  reset: () => Promise<void>
}

/**
 * Create a singleton promise function that caches its result.
 *
 * The promise function will only execute once. Subsequent calls return the same promise.
 * Use `reset()` to clear the cache and allow re-execution.
 *
 * @category Promise
 * @param fn - The async function to wrap
 * @returns A function that returns the cached promise, with a `reset` method
 * @example
 * ```ts
 * const getUser = createSingletonPromise(async () => {
 *   return await fetchUser()
 * })
 *
 * await getUser() // Fetches user
 * await getUser() // Returns cached promise
 * await getUser.reset() // Clears cache
 * await getUser() // Fetches user again
 * ```
 */
export function createSingletonPromise<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
  let _promise: Promise<T> | undefined

  function wrapper() {
    if (!_promise)
      _promise = fn()
    return _promise
  }
  wrapper.reset = async () => {
    const _prev = _promise
    _promise = undefined
    if (_prev)
      await _prev
  }

  return wrapper
}

/**
 * Promised `setTimeout` - sleep for a specified duration.
 *
 * Optionally execute a callback after the delay.
 *
 * @category Promise
 * @param ms - Milliseconds to sleep
 * @param callback - Optional function to call after sleeping
 * @returns A promise that resolves after the delay
 * @example
 * ```ts
 * await sleep(1000) // Sleep for 1 second
 *
 * await sleep(500, () => {
 *   console.log('Woke up!')
 * })
 * ```
 */
export function sleep(ms: number, callback?: Fn<any>) {
  return new Promise<void>(resolve =>

    setTimeout(async () => {
      await callback?.()
      resolve()
    }, ms),
  )
}

/**
 * Create a promise lock for tracking and waiting on multiple async tasks.
 *
 * Useful for coordinating multiple concurrent operations and waiting for all to complete.
 *
 * @category Promise
 * @returns An object with `run`, `wait`, `isWaiting`, and `clear` methods
 * @example
 * ```ts
 * const lock = createPromiseLock()
 *
 * // Start multiple async tasks
 * lock.run(async () => await fetchData1())
 * lock.run(async () => await fetchData2())
 *
 * // In another context, wait for all to complete
 * await lock.wait()
 *
 * // Check if any tasks are running
 * if (lock.isWaiting()) {
 *   console.log('Still running...')
 * }
 * ```
 */
export function createPromiseLock() {
  const locks: Promise<any>[] = []

  return {
    async run<T = void>(fn: () => Promise<T>): Promise<T> {
      const p = fn()
      locks.push(p)
      try {
        return await p
      }
      finally {
        remove(locks, p)
      }
    },
    async wait(): Promise<void> {
      await Promise.allSettled(locks)
    },
    isWaiting() {
      return Boolean(locks.length)
    },
    clear() {
      locks.length = 0
    },
  }
}

/**
 * A Promise with externally accessible `resolve` and `reject` methods.
 *
 * @category Promise
 */
export interface ControlledPromise<T = void> extends Promise<T> {
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

/**
 * Create a Promise with externally accessible `resolve` and `reject` methods.
 *
 * Useful when the promise resolution needs to happen in a different context
 * from where the promise is awaited.
 *
 * @category Promise
 * @returns A promise with `resolve` and `reject` methods attached
 * @example
 * ```ts
 * const promise = createControlledPromise<string>()
 *
 * // In one context, await the promise
 * const result = await promise
 *
 * // In another context, resolve it
 * promise.resolve('done!')
 *
 * // Or reject it
 * promise.reject(new Error('failed'))
 * ```
 */
export function createControlledPromise<T>(): ControlledPromise<T> {
  let resolve: any, reject: any
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }) as ControlledPromise<T>
  promise.resolve = resolve
  promise.reject = reject
  return promise
}
