import type { Arrayable, Nullable } from './types'
import { clamp } from './math'

/**
 * Convert `Arrayable<T>` to `Array<T>`.
 *
 * Wraps a single value in an array, or returns the array as-is.
 *
 * @category Array
 * @param array - Value or array to convert
 * @returns An array containing the value(s)
 * @example
 * ```ts
 * toArray(1) // [1]
 * toArray([1, 2]) // [1, 2]
 * toArray(null) // []
 * toArray(undefined) // []
 * ```
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array ?? []
  return Array.isArray(array) ? array : [array]
}

/**
 * Convert `Arrayable<T>` to `Array<T>` and flatten it one level deep.
 *
 * @category Array
 * @param array - Value or nested array to flatten
 * @returns A flattened array
 * @example
 * ```ts
 * flattenArrayable([1, [2, 3]]) // [1, 2, 3]
 * flattenArrayable([[1], [2]]) // [1, 2]
 * flattenArrayable(1) // [1]
 * ```
 */
export function flattenArrayable<T>(array?: Nullable<Arrayable<T | Array<T>>>): Array<T> {
  return toArray(array).flat(1) as Array<T>
}

/**
 * Merge multiple arrays or values into a single array.
 *
 * @category Array
 * @param args - Values or arrays to merge
 * @returns A single merged array
 * @example
 * ```ts
 * mergeArrayable([1, 2], [3, 4]) // [1, 2, 3, 4]
 * mergeArrayable(1, 2, [3, 4]) // [1, 2, 3, 4]
 * mergeArrayable([1], null, [2]) // [1, 2]
 * ```
 */
export function mergeArrayable<T>(...args: Nullable<Arrayable<T>>[]): Array<T> {
  return args.flatMap(i => toArray(i))
}

export type PartitionFilter<T> = (i: T, idx: number, arr: readonly T[]) => any

/**
 * Divide an array into two parts by a filter function.
 *
 * Items matching the filter go into the first partition, others into the second.
 *
 * @category Array
 * @param array - The array to partition
 * @param f1 - Filter function to determine the first partition
 * @returns A tuple of two arrays: [matching, non-matching]
 * @example
 * ```ts
 * const [odd, even] = partition([1, 2, 3, 4], i => i % 2 !== 0)
 * // odd = [1, 3], even = [2, 4]
 * ```
 */
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>): [T[], T[]]
/**
 * Divide an array into multiple parts by filter functions.
 *
 * Each filter creates a partition. Items not matching any filter go into the last partition.
 *
 * @category Array
 * @param array - The array to partition
 * @param f1 - First filter function
 * @param f2 - Second filter function
 * @returns A tuple of arrays for each partition
 * @example
 * ```ts
 * const [small, medium, large] = partition(
 *   [1, 2, 3, 4, 5, 6],
 *   i => i < 3,
 *   i => i < 5
 * )
 * // small = [1, 2], medium = [3, 4], large = [5, 6]
 * ```
 */
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>): [T[], T[], T[]]
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>): [T[], T[], T[], T[]]
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>, f4: PartitionFilter<T>): [T[], T[], T[], T[], T[]]
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>, f4: PartitionFilter<T>, f5: PartitionFilter<T>): [T[], T[], T[], T[], T[], T[]]
export function partition<T>(array: readonly T[], f1: PartitionFilter<T>, f2: PartitionFilter<T>, f3: PartitionFilter<T>, f4: PartitionFilter<T>, f5: PartitionFilter<T>, f6: PartitionFilter<T>): [T[], T[], T[], T[], T[], T[], T[]]
export function partition<T>(array: readonly T[], ...filters: PartitionFilter<T>[]): any {
  const result: T[][] = Array.from({ length: filters.length + 1 }).fill(null).map(() => [])

  array.forEach((e, idx, arr) => {
    let i = 0
    for (const filter of filters) {
      if (filter(e, idx, arr)) {
        result[i].push(e)
        return
      }
      i += 1
    }
    result[i].push(e)
  })
  return result
}

/**
 * Remove duplicate values from an array.
 *
 * Uses Set internally, so works best with primitive values.
 *
 * @category Array
 * @param array - The array to deduplicate
 * @returns A new array with unique values
 * @example
 * ```ts
 * uniq([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 * uniq(['a', 'b', 'a']) // ['a', 'b']
 * ```
 */
export function uniq<T>(array: readonly T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * Remove duplicate values from an array using a custom equality function.
 *
 * Useful for deduplicating arrays of objects.
 *
 * @category Array
 * @param array - The array to deduplicate
 * @param equalFn - Function to compare two items for equality
 * @returns A new array with unique values
 * @example
 * ```ts
 * const users = [{ id: 1 }, { id: 2 }, { id: 1 }]
 * uniqueBy(users, (a, b) => a.id === b.id)
 * // [{ id: 1 }, { id: 2 }]
 * ```
 */
export function uniqueBy<T>(array: readonly T[], equalFn: (a: any, b: any) => boolean): T[] {
  return array.reduce((acc: T[], cur: any) => {
    const index = acc.findIndex((item: any) => equalFn(cur, item))
    if (index === -1)
      acc.push(cur)
    return acc
  }, [])
}

/**
 * Get the last item of an empty array.
 *
 * @category Array
 * @param array - An empty array
 */
export function last(array: readonly []): undefined
/**
 * Get the last item of an array.
 *
 * @category Array
 * @param array - The array to get the last item from
 * @returns The last item
 * @example
 * ```ts
 * last([1, 2, 3]) // 3
 * last(['a', 'b']) // 'b'
 * last([]) // undefined
 * ```
 */
export function last<T>(array: readonly T[]): T
export function last<T>(array: readonly T[]): T | undefined {
  return at(array, -1)
}

/**
 * Remove an item from an array by value. Mutates the array.
 *
 * Only removes the first occurrence of the value.
 *
 * @category Array
 * @param array - The array to remove from (will be mutated)
 * @param value - The value to remove
 * @returns True if the item was found and removed, false otherwise
 * @example
 * ```ts
 * const arr = [1, 2, 3, 2]
 * remove(arr, 2) // true, arr is now [1, 3, 2]
 * remove(arr, 5) // false, arr unchanged
 * ```
 */
export function remove<T>(array: T[], value: T) {
  if (!array)
    return false
  const index = array.indexOf(value)
  if (index >= 0) {
    array.splice(index, 1)
    return true
  }
  return false
}

/**
 * Get the nth item of an empty array.
 *
 * @category Array
 * @param array - An empty array
 * @param index - The index
 */
export function at(array: readonly [], index: number): undefined
/**
 * Get the nth item of an array. Supports negative indices for backward access.
 *
 * @category Array
 * @param array - The array to access
 * @param index - The index (negative for backward)
 * @returns The item at the index
 * @example
 * ```ts
 * at([1, 2, 3], 0) // 1
 * at([1, 2, 3], -1) // 3
 * at([1, 2, 3], -2) // 2
 * at([1, 2, 3], 5) // undefined
 * ```
 */
export function at<T>(array: readonly T[], index: number): T
export function at<T>(array: readonly T[] | [], index: number): T | undefined {
  const len = array.length
  if (!len)
    return undefined

  if (index < 0)
    index += len

  return array[index]
}

/**
 * Generate a range array of numbers from 0 to stop (exclusive).
 *
 * @category Array
 * @param stop - End of range (exclusive), starts from 0
 * @returns Array of numbers in the range [0, stop)
 * @example
 * ```ts
 * range(5) // [0, 1, 2, 3, 4]
 * ```
 */
export function range(stop: number): number[]
/**
 * Generate a range array of numbers from start to stop (exclusive).
 *
 * @category Array
 * @param start - Start of range (inclusive)
 * @param stop - End of range (exclusive)
 * @param step - Step increment (default: 1)
 * @returns Array of numbers in the range [start, stop)
 * @example
 * ```ts
 * range(2, 5) // [2, 3, 4]
 * range(0, 10, 2) // [0, 2, 4, 6, 8]
 * ```
 */
export function range(start: number, stop: number, step?: number): number[]
export function range(...args: any): number[] {
  let start: number, stop: number, step: number

  if (args.length === 1) {
    start = 0
    step = 1;
    ([stop] = args)
  }
  else {
    ([start, stop, step = 1] = args)
  }

  const arr: number[] = []
  let current = start
  while (current < stop) {
    arr.push(current)
    current += step || 1
  }

  return arr
}

/**
 * Move an element in an array from one index to another. Mutates the array.
 *
 * @category Array
 * @param arr - The array to modify (will be mutated)
 * @param from - Source index
 * @param to - Destination index
 * @returns The modified array
 * @example
 * ```ts
 * const arr = ['a', 'b', 'c', 'd']
 * move(arr, 0, 2) // ['b', 'c', 'a', 'd']
 * move(arr, 3, 1) // ['b', 'd', 'c', 'a']
 * ```
 */
export function move<T>(arr: T[], from: number, to: number) {
  arr.splice(to, 0, arr.splice(from, 1)[0])
  return arr
}

/**
 * Clamp a number to the valid index range of an array.
 *
 * @category Array
 * @param n - The number to clamp
 * @param arr - The array to get the range from
 * @returns The clamped index (between 0 and arr.length - 1)
 * @example
 * ```ts
 * clampArrayRange(-5, [1, 2, 3]) // 0
 * clampArrayRange(1, [1, 2, 3]) // 1
 * clampArrayRange(10, [1, 2, 3]) // 2
 * ```
 */
export function clampArrayRange(n: number, arr: readonly unknown[]) {
  return clamp(n, 0, arr.length - 1)
}

/**
 * Get random item(s) from an array.
 *
 * Items may be selected multiple times (sampling with replacement).
 *
 * @category Array
 * @param arr - The array to sample from
 * @param quantity - Number of random items to return
 * @returns Array of randomly selected items
 * @example
 * ```ts
 * sample([1, 2, 3, 4, 5], 2) // e.g., [3, 1]
 * sample(['a', 'b', 'c'], 3) // e.g., ['b', 'a', 'b']
 * ```
 */
export function sample<T>(arr: T[], quantity: number): T[] {
  if (arr.length === 0)
    return []
  return Array.from({ length: quantity }, _ => arr[Math.floor(Math.random() * arr.length)])
}

/**
 * Shuffle an array randomly. This function mutates the array.
 *
 * Uses the Fisher-Yates shuffle algorithm.
 *
 * @category Array
 * @param array - The array to shuffle (will be mutated)
 * @returns The shuffled array
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5]
 * shuffle(arr) // e.g., [3, 1, 5, 2, 4]
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * Filter out items from an array in place. This function mutates the array.
 *
 * The predicate iterates from the end to the start for better performance.
 * Faster than `Array.prototype.filter` on large arrays since it avoids creating a new array.
 * [Read More](https://jsbenchmark.com/#eyJjYXNlcyI6W3siaWQiOiJXR01CMEJLVXgwbUJDYVc3NmFHSVciLCJjb2RlIjoibGV0IGEgPSBEQVRBXG5hID0gZmlsdGVyKGEsIGkgPT4gaSAlIDUwID09PSAwKVxuYSA9IGZpbHRlcihhLCBpID0-IGkgJSAxMCA9PT0gMClcbmEgPSBmaWx0ZXIoYSwgaSA9PiBpICUgMiA9PT0gMCkiLCJuYW1lIjoiZmlsdGVyIiwiZGVwZW5kZW5jaWVzIjpbXX0seyJpZCI6Ik9VSnozNU1QTkdhWVZ2eVo3S3A1UiIsImNvZGUiOiJsZXQgYSA9IERBVEFcbmEgPSBmaWx0ZXJJblBsYWNlKGEsIGkgPT4gaSAlIDUwID09PSAwKVxuYSA9IGZpbHRlckluUGxhY2UoYSwgaSA9PiBpICUgMTAgPT09IDApXG5hID0gZmlsdGVySW5QbGFjZShhLCBpID0-IGkgJSAyID09PSAwKSIsIm5hbWUiOiJmaWx0ZXJJblBsYWNlIiwiZGVwZW5kZW5jaWVzIjpbXX1dLCJjb25maWciOnsibmFtZSI6IkJhc2ljIGV4YW1wbGUiLCJwYXJhbGxlbCI6dHJ1ZSwiZ2xvYmFsVGVzdENvbmZpZyI6eyJkZXBlbmRlbmNpZXMiOltdfSwiZGF0YUNvZGUiOiJnbG9iYWxUaGlzLmZpbHRlciA9IGZ1bmN0aW9uIGZpbHRlcihkYXRhLCBwcmVkaWNhdGUpIHtcbiAgcmV0dXJuIGRhdGEuZmlsdGVyKHByZWRpY2F0ZSlcbn1cblxuZ2xvYmFsVGhpcy5maWx0ZXJJblBsYWNlID0gZnVuY3Rpb24gZmlsdGVySW5QbGFjZShkYXRhLCBwcmVkaWNhdGUpIHtcbiAgZm9yIChsZXQgaSA9IGRhdGEubGVuZ3RoOyBpLS07IGk-PTApIHtcbiAgICBpZiAoIXByZWRpY2F0ZShkYXRhW2ldLCBpLCBkYXRhKSlcbiAgICAgIGRhdGEuc3BsaWNlKGksIDEpXG4gIH1cbiAgcmV0dXJuIGRhdGFcbn1cblxucmV0dXJuIFsuLi5BcnJheSgxMDAwKS5rZXlzKCksLi4uQXJyYXkoMTAwMCkua2V5cygpLC4uLkFycmF5KDEwMDApLmtleXMoKV0ifX0)
 *
 * @category Array
 * @param array - The array to filter (will be mutated)
 * @param predicate - Function that returns true for items to keep
 * @returns The filtered array (same reference)
 * @example
 * ```ts
 * const arr = [1, 2, 3, 4, 5]
 * filterInPlace(arr, i => i % 2 !== 0)
 * console.log(arr) // [1, 3, 5]
 * ```
 */
export function filterInPlace<T>(array: T[], predicate: (item: T, index: number, arr: T[]) => unknown) {
  for (let i = array.length; i--; i >= 0) {
    if (!predicate(array[i], i, array))
      array.splice(i, 1)
  }
  return array
}

/**
 * Group an array of objects by a key.
 *
 * @category Array
 * @param arr - The array to group
 * @param key - The key to group by
 * @returns An object with keys as group names and values as arrays of items
 * @example
 * ```ts
 * const users = [
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' },
 *   { id: 1, name: 'Johnny' }
 * ]
 * groupBy(users, 'id')
 * // { '1': [{ id: 1, name: 'John' }, { id: 1, name: 'Johnny' }], '2': [{ id: 2, name: 'Jane' }] }
 * ```
 */
export function groupBy<T, K extends keyof T>(
  arr: T[],
  key: K,
): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key])
    groups[groupKey] = groups[groupKey] ?? []
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}
