import { toString } from './base'

/**
 * Checks if a value is defined (not undefined).
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is not undefined
 * @example
 * ```ts
 * isDef(1) // true
 * isDef(null) // true
 * isDef(undefined) // false
 * ```
 */
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'

/**
 * Checks if a value is a boolean.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a boolean
 * @example
 * ```ts
 * isBoolean(true) // true
 * isBoolean(false) // true
 * isBoolean(0) // false
 * ```
 */
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'

/**
 * Checks if a value is a function.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a function
 * @example
 * ```ts
 * isFunction(() => {}) // true
 * isFunction(function() {}) // true
 * isFunction(class {}) // true
 * isFunction({}) // false
 * ```
 */
// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = <T extends Function> (val: any): val is T => typeof val === 'function'

/**
 * Checks if a value is a number.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a number (including NaN and Infinity)
 * @example
 * ```ts
 * isNumber(42) // true
 * isNumber(3.14) // true
 * isNumber(NaN) // true
 * isNumber('42') // false
 * ```
 */
export const isNumber = (val: any): val is number => typeof val === 'number'

/**
 * Checks if a value is a string.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a string
 * @example
 * ```ts
 * isString('hello') // true
 * isString('') // true
 * isString(123) // false
 * ```
 */
export const isString = (val: unknown): val is string => typeof val === 'string'

/**
 * Checks if a value is a plain object (not an array, null, or other object types).
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a plain object
 * @example
 * ```ts
 * isObject({}) // true
 * isObject({ a: 1 }) // true
 * isObject([]) // false
 * isObject(null) // false
 * ```
 */
export const isObject = (val: any): val is object => toString(val) === '[object Object]'

/**
 * Checks if a value is undefined.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is undefined
 * @example
 * ```ts
 * isUndefined(undefined) // true
 * isUndefined(null) // false
 * isUndefined(0) // false
 * ```
 */
export const isUndefined = (val: any): val is undefined => toString(val) === '[object Undefined]'

/**
 * Checks if a value is null.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is null
 * @example
 * ```ts
 * isNull(null) // true
 * isNull(undefined) // false
 * isNull(0) // false
 * ```
 */
export const isNull = (val: any): val is null => toString(val) === '[object Null]'

/**
 * Checks if a value is a RegExp.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a RegExp
 * @example
 * ```ts
 * isRegExp(/test/) // true
 * isRegExp(new RegExp('test')) // true
 * isRegExp('test') // false
 * ```
 */
export const isRegExp = (val: any): val is RegExp => toString(val) === '[object RegExp]'

/**
 * Checks if a value is a Date object.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a Date object
 * @example
 * ```ts
 * isDate(new Date()) // true
 * isDate(Date.now()) // false (this is a number)
 * isDate('2024-01-01') // false
 * ```
 */
export const isDate = (val: any): val is Date => toString(val) === '[object Date]'

/**
 * Checks if a value is a primitive type.
 *
 * Primitive types include: string, number, boolean, symbol, bigint, null, and undefined.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a primitive
 * @example
 * ```ts
 * isPrimitive(42) // true
 * isPrimitive('hello') // true
 * isPrimitive(null) // true
 * isPrimitive({}) // false
 * isPrimitive([]) // false
 * ```
 */
export function isPrimitive(val: any): val is string | number | boolean | symbol | bigint | null | undefined {
  return !val || Object(val) !== val
}

/**
 * Checks if a value is a Window object.
 *
 * @category Is
 * @param val - The value to check
 * @returns True if the value is a Window object
 * @example
 * ```ts
 * isWindow(window) // true (in browser)
 * isWindow({}) // false
 * ```
 */
// @ts-expect-error
export const isWindow = (val: any): boolean => typeof window !== 'undefined' && toString(val) === '[object Window]'

/**
 * Checks if the code is running in a browser environment.
 *
 * @category Is
 * @example
 * ```ts
 * if (isBrowser) {
 *   // Browser-specific code
 *   document.querySelector('#app')
 * }
 * ```
 */
// @ts-expect-error
export const isBrowser = typeof window !== 'undefined'
