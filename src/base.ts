/**
 * Asserts that a condition is true, throwing an error with the provided message if not.
 *
 * @category Base
 * @param condition - The condition to assert
 * @param message - The error message to throw if the condition is false
 * @throws {Error} Throws an error with the provided message if condition is false
 * @example
 * ```ts
 * assert(user !== null, 'User must be defined')
 * // If user is null, throws Error: 'User must be defined'
 * ```
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition)
    throw new Error(message)
}

/**
 * Returns the internal [[Class]] property of a value as a string.
 *
 * @category Base
 * @param v - The value to get the string representation of
 * @returns The string representation in format '[object Type]'
 * @example
 * ```ts
 * toString({}) // '[object Object]'
 * toString([]) // '[object Array]'
 * toString(null) // '[object Null]'
 * ```
 */
export const toString = (v: any) => Object.prototype.toString.call(v)

/**
 * Gets the type name of a value as a lowercase string.
 *
 * @category Base
 * @param v - The value to get the type name of
 * @returns The type name as a lowercase string
 * @example
 * ```ts
 * getTypeName(null) // 'null'
 * getTypeName({}) // 'object'
 * getTypeName([]) // 'array'
 * getTypeName(42) // 'number'
 * getTypeName('hello') // 'string'
 * getTypeName(() => {}) // 'function'
 * ```
 */
export function getTypeName(v: any) {
  if (v === null)
    return 'null'
  const type = toString(v).slice(8, -1).toLowerCase()
  return (typeof v === 'object' || typeof v === 'function') ? type : typeof v
}

/**
 * A no-operation function that does nothing.
 *
 * @category Base
 * @example
 * ```ts
 * // Use as a default callback
 * const callback = options.onComplete || noop
 *
 * // Use to explicitly ignore promise rejections
 * promise.catch(noop)
 * ```
 */
export function noop() {}
