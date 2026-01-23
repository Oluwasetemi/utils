import { getTypeName } from './base'

/**
 * Performs a deep equality comparison between two values.
 *
 * Recursively compares objects and arrays by their contents.
 * Uses Object.is() for primitive value comparison.
 *
 * @category Equal
 * @param value1 - The first value to compare
 * @param value2 - The second value to compare
 * @returns True if the values are deeply equal, false otherwise
 * @example
 * ```ts
 * isDeepEqual({ a: 1 }, { a: 1 }) // true
 * isDeepEqual([1, 2, 3], [1, 2, 3]) // true
 * isDeepEqual({ a: { b: 1 } }, { a: { b: 1 } }) // true
 * isDeepEqual({ a: 1 }, { a: 2 }) // false
 * isDeepEqual([1, 2], [1, 2, 3]) // false
 * isDeepEqual(NaN, NaN) // true (uses Object.is)
 * ```
 */
export function isDeepEqual(value1: any, value2: any): boolean {
  const type1 = getTypeName(value1)
  const type2 = getTypeName(value2)
  if (type1 !== type2)
    return false

  if (type1 === 'array') {
    if (value1.length !== value2.length)
      return false

    return value1.every((item: any, i: number) => {
      return isDeepEqual(item, value2[i])
    })
  }
  if (type1 === 'object') {
    const keyArr = Object.keys(value1)
    if (keyArr.length !== Object.keys(value2).length)
      return false

    return keyArr.every((key: string) => {
      return isDeepEqual(value1[key], value2[key])
    })
  }
  return Object.is(value1, value2)
}
