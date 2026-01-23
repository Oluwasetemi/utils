/**
 * Type guard to filter out null and undefined values.
 *
 * @category Guards
 * @param v - The value to check
 * @returns True if the value is not null or undefined
 * @example
 * ```ts
 * const arr = [1, null, 2, undefined, 3]
 * arr.filter(notNullish) // [1, 2, 3] with type number[]
 * ```
 */
export function notNullish<T>(v: T | null | undefined): v is NonNullable<T> {
  return v != null
}

/**
 * Type guard to filter out null values.
 *
 * @category Guards
 * @param v - The value to check
 * @returns True if the value is not null
 * @example
 * ```ts
 * const arr = [1, null, 2, null, 3]
 * arr.filter(noNull) // [1, 2, 3] with type number[]
 * ```
 */
export function noNull<T>(v: T | null): v is Exclude<T, null> {
  return v !== null
}

/**
 * Type guard to filter out undefined values.
 *
 * @category Guards
 * @param v - The value to check
 * @returns True if the value is not undefined
 * @example
 * ```ts
 * const arr = [1, undefined, 2, undefined, 3]
 * arr.filter(notUndefined) // [1, 2, 3] with type number[]
 * ```
 */
export function notUndefined<T>(v: T): v is Exclude<T, undefined> {
  return v !== undefined
}

/**
 * Type guard to filter out falsy values (false, 0, '', null, undefined, NaN).
 *
 * @category Guards
 * @param v - The value to check
 * @returns True if the value is truthy
 * @example
 * ```ts
 * const arr = [0, 1, '', 'hello', null, true, false]
 * arr.filter(isTruthy) // [1, 'hello', true]
 * ```
 */
export function isTruthy<T>(v: T): v is NonNullable<T> {
  return Boolean(v)
}
