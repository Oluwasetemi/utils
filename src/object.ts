import type { DeepMerge } from './types'
import { notNullish } from './guards'
import { isObject, isPrimitive } from './is'
import { randomStr } from './string'

/**
 * Map key/value pairs for an object, and construct a new one
 *
 *
 * @category Object
 *
 * Transform:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => [k.toString().toUpperCase(), v.toString()])
 * // { A: '1', B: '2' }
 * ```
 *
 * Swap key/value:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => [v, k])
 * // { 1: 'a', 2: 'b' }
 * ```
 *
 * Filter keys:
 * @example
 * ```
 * objectMap({ a: 1, b: 2 }, (k, v) => k === 'a' ? undefined : [k, v])
 * // { b: 2 }
 * ```
 */
export function objectMap<K extends string, V, NK extends string | number | symbol = K, NV = V>(obj: Record<K, V>, fn: (key: K, value: V) => [NK, NV] | undefined): Record<NK, NV> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => fn(k as K, v as V))
      .filter(notNullish),
  ) as Record<NK, NV>
}

/**
 * Type guard for any key, `k`.
 * Marks `k` as a key of `T` if `k` is in `obj`.
 *
 * @category Object
 * @param obj - Object to query for key `k`
 * @param k - Key to check existence in `obj`
 * @returns True if `k` is a key of `obj`
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 }
 * isKeyOf(obj, 'a') // true
 * isKeyOf(obj, 'c') // false
 * ```
 */
export function isKeyOf<T extends object>(obj: T, k: keyof any): k is keyof T {
  return k in obj
}

/**
 * Strict typed `Object.keys`
 *
 * Returns the keys of an object with proper TypeScript typing.
 *
 * @category Object
 * @param obj - The object to get keys from
 * @returns Array of keys with strict typing
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * objectKeys(obj) // ['a', 'b', 'c'] with type ('a' | 'b' | 'c')[]
 * ```
 */
export function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<`${keyof T & (string | number | boolean | null | undefined)}`>
}

/**
 * Strict typed `Object.entries`
 *
 * Returns the entries of an object with proper TypeScript typing.
 *
 * @category Object
 * @param obj - The object to get entries from
 * @returns Array of [key, value] tuples with strict typing
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 }
 * objectEntries(obj) // [['a', 1], ['b', 2]] with type [keyof typeof obj, number][]
 * ```
 */
export function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

/**
 * Deep merge objects recursively.
 *
 * The first argument is the target object, the rest are the sources.
 * The target object will be mutated and returned.
 * Arrays are overwritten, not merged.
 *
 * @category Object
 * @param target - The target object to merge into (will be mutated)
 * @param sources - Source objects to merge from
 * @returns The mutated target object with merged properties
 * @example
 * ```ts
 * const target = { a: 1, b: { c: 2 } }
 * const source = { b: { d: 3 }, e: 4 }
 * deepMerge(target, source)
 * // { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 */
export function deepMerge<T extends object = object, S extends object = T>(target: T, ...sources: S[]): DeepMerge<T, S> {
  if (!sources.length)
    return target as any

  const source = sources.shift()
  if (source === undefined)
    return target as any

  if (isMergableObject(target) && isMergableObject(source)) {
    objectKeys(source).forEach((key) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        return

      // @ts-expect-error
      if (isMergableObject(source[key])) {
        // @ts-expect-error
        if (!target[key])
          // @ts-expect-error
          target[key] = {}

        // @ts-expect-error
        if (isMergableObject(target[key])) {
          deepMerge(target[key], source[key])
        }
        else {
          // @ts-expect-error
          target[key] = source[key]
        }
      }
      else {
        // @ts-expect-error
        target[key] = source[key]
      }
    })
  }

  return deepMerge(target, ...sources)
}

/**
 * Deep merge objects recursively, concatenating arrays.
 *
 * Differs from `deepMerge` in that it merges arrays instead of overriding them.
 *
 * The first argument is the target object, the rest are the sources.
 * The target object will be mutated and returned.
 *
 * @category Object
 * @param target - The target object to merge into (will be mutated)
 * @param sources - Source objects to merge from
 * @returns The mutated target object with merged properties
 * @example
 * ```ts
 * const target = { a: [1, 2], b: { c: 2 } }
 * const source = { a: [3, 4], b: { d: 3 } }
 * deepMergeWithArray(target, source)
 * // { a: [1, 2, 3, 4], b: { c: 2, d: 3 } }
 * ```
 */
export function deepMergeWithArray<T extends object = object, S extends object = T>(target: T, ...sources: S[]): DeepMerge<T, S> {
  if (!sources.length)
    return target as any

  const source = sources.shift()
  if (source === undefined)
    return target as any

  if (Array.isArray(target) && Array.isArray(source))
    target.push(...source)

  if (isMergableObject(target) && isMergableObject(source)) {
    objectKeys(source).forEach((key) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype')
        return

      // @ts-expect-error
      if (Array.isArray(source[key])) {
        // @ts-expect-error
        if (!target[key])
          // @ts-expect-error
          target[key] = []

        // @ts-expect-error
        deepMergeWithArray(target[key], source[key])
      }
      // @ts-expect-error
      else if (isMergableObject(source[key])) {
        // @ts-expect-error
        if (!target[key])
          // @ts-expect-error
          target[key] = {}

        // @ts-expect-error
        deepMergeWithArray(target[key], source[key])
      }
      else {
        // @ts-expect-error
        target[key] = source[key]
      }
    })
  }

  return deepMergeWithArray(target, ...sources)
}

function isMergableObject(item: any): item is object {
  return isObject(item) && !Array.isArray(item)
}

/**
 * Create a new subset object by picking specific keys.
 *
 * @category Object
 * @param obj - The source object to pick from
 * @param keys - Array of keys to include in the new object
 * @param omitUndefined - If true, omit keys with undefined values
 * @returns A new object containing only the specified keys
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * objectPick(obj, ['a', 'c']) // { a: 1, c: 3 }
 *
 * const obj2 = { a: 1, b: undefined }
 * objectPick(obj2, ['a', 'b'], true) // { a: 1 }
 * ```
 */
export function objectPick<O extends object, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
  return keys.reduce((n, k) => {
    if (k in obj) {
      if (!omitUndefined || obj[k] !== undefined)
        n[k] = obj[k]
    }
    return n
  }, {} as Pick<O, T>)
}

/**
 * Create a new subset object by omitting specific keys.
 *
 * @category Object
 * @param obj - The source object to omit from
 * @param keys - Array of keys to exclude from the new object
 * @param omitUndefined - If true, also omit keys with undefined values
 * @returns A new object without the specified keys
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 }
 * objectOmit(obj, ['b']) // { a: 1, c: 3 }
 *
 * const obj2 = { a: 1, b: 2, c: undefined }
 * objectOmit(obj2, ['b'], true) // { a: 1 }
 * ```
 */
export function objectOmit<O extends object, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => {
    return (!omitUndefined || value !== undefined) && !keys.includes(key as T)
  })) as Omit<O, T>
}

/**
 * Clear undefined fields from an object. It mutates the object.
 *
 * @category Object
 * @param obj - The object to clear undefined fields from (will be mutated)
 * @returns The same object with undefined fields removed
 * @example
 * ```ts
 * const obj = { a: 1, b: undefined, c: 3 }
 * clearUndefined(obj) // { a: 1, c: 3 }
 * ```
 */
export function clearUndefined<T extends object>(obj: T): T {
  // @ts-expect-error
  Object.keys(obj).forEach((key: string) => (obj[key] === undefined ? delete obj[key] : {}))
  return obj
}

/**
 * Determines whether an object has a property with the specified name.
 *
 * Safe alternative to `obj.hasOwnProperty(key)` that works with objects
 * that don't inherit from Object.prototype.
 *
 * @see https://eslint.org/docs/rules/no-prototype-builtins
 * @category Object
 * @param obj - The object to check
 * @param v - The property key to check for
 * @returns True if the object has the property as its own (not inherited)
 * @example
 * ```ts
 * hasOwnProperty({ a: 1 }, 'a') // true
 * hasOwnProperty({ a: 1 }, 'b') // false
 * hasOwnProperty({ a: 1 }, 'toString') // false (inherited)
 * hasOwnProperty(null, 'a') // false (safe with null)
 * ```
 */
export function hasOwnProperty<T>(obj: T, v: PropertyKey) {
  if (obj == null)
    return false
  return Object.prototype.hasOwnProperty.call(obj, v)
}

const _objectIdMap = /* @__PURE__ */ new WeakMap<WeakKey, string>()
/**
 * Get an object's unique identifier.
 *
 * Same object will always return the same id.
 * Useful for tracking object identity across operations.
 *
 * Expects argument to be a non-primitive object/array. Primitive values will be returned as is.
 *
 * @category Object
 * @param obj - The object to get an identifier for
 * @returns A unique string identifier for the object
 * @example
 * ```ts
 * const obj = { a: 1 }
 * const id1 = objectId(obj) // 'abc123'
 * const id2 = objectId(obj) // 'abc123' (same id)
 * const id3 = objectId({ a: 1 }) // 'xyz789' (different object, different id)
 * ```
 */
export function objectId(obj: WeakKey): string {
  if (isPrimitive(obj))
    return obj as unknown as string
  if (!_objectIdMap.has(obj)) {
    _objectIdMap.set(obj, randomStr())
  }
  return _objectIdMap.get(obj)!
}
