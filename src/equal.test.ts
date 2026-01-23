import { describe, expect, it } from 'vitest'
import { isDeepEqual } from './equal'

describe('isDeepEqual', () => {
  describe('primitives', () => {
    it('should return true for equal numbers', () => {
      expect(isDeepEqual(1, 1)).toBe(true)
      expect(isDeepEqual(0, 0)).toBe(true)
      expect(isDeepEqual(-1, -1)).toBe(true)
    })

    it('should return false for different numbers', () => {
      expect(isDeepEqual(1, 2)).toBe(false)
    })

    it('should return true for equal strings', () => {
      expect(isDeepEqual('hello', 'hello')).toBe(true)
      expect(isDeepEqual('', '')).toBe(true)
    })

    it('should return false for different strings', () => {
      expect(isDeepEqual('hello', 'world')).toBe(false)
    })

    it('should return true for equal booleans', () => {
      expect(isDeepEqual(true, true)).toBe(true)
      expect(isDeepEqual(false, false)).toBe(true)
    })

    it('should return false for different booleans', () => {
      expect(isDeepEqual(true, false)).toBe(false)
    })

    it('should handle null and undefined', () => {
      expect(isDeepEqual(null, null)).toBe(true)
      expect(isDeepEqual(undefined, undefined)).toBe(true)
      expect(isDeepEqual(null, undefined)).toBe(false)
    })

    it('should handle NaN using Object.is', () => {
      expect(isDeepEqual(Number.NaN, Number.NaN)).toBe(true)
    })

    it('should differentiate between 0 and -0 using Object.is', () => {
      expect(isDeepEqual(0, -0)).toBe(false)
    })
  })

  describe('arrays', () => {
    it('should return true for equal arrays', () => {
      expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(isDeepEqual([], [])).toBe(true)
    })

    it('should return false for arrays with different lengths', () => {
      expect(isDeepEqual([1, 2], [1, 2, 3])).toBe(false)
    })

    it('should return false for arrays with different values', () => {
      expect(isDeepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    })

    it('should handle nested arrays', () => {
      expect(isDeepEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true)
      expect(isDeepEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]])).toBe(false)
    })
  })

  describe('objects', () => {
    it('should return true for equal objects', () => {
      expect(isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
      expect(isDeepEqual({}, {})).toBe(true)
    })

    it('should return false for objects with different keys', () => {
      expect(isDeepEqual({ a: 1 }, { b: 1 })).toBe(false)
      expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    })

    it('should return false for objects with different values', () => {
      expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false)
    })

    it('should handle nested objects', () => {
      expect(isDeepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
      expect(isDeepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false)
    })

    it('should handle deeply nested structures', () => {
      const obj1 = { a: { b: { c: { d: 1 } } } }
      const obj2 = { a: { b: { c: { d: 1 } } } }
      const obj3 = { a: { b: { c: { d: 2 } } } }
      expect(isDeepEqual(obj1, obj2)).toBe(true)
      expect(isDeepEqual(obj1, obj3)).toBe(false)
    })
  })

  describe('mixed types', () => {
    it('should return false for different types', () => {
      expect(isDeepEqual(1, '1')).toBe(false)
      expect(isDeepEqual([], {})).toBe(false)
      expect(isDeepEqual(null, {})).toBe(false)
      expect(isDeepEqual(undefined, null)).toBe(false)
    })

    it('should handle objects containing arrays', () => {
      expect(isDeepEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true)
      expect(isDeepEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false)
    })

    it('should handle arrays containing objects', () => {
      expect(isDeepEqual([{ a: 1 }], [{ a: 1 }])).toBe(true)
      expect(isDeepEqual([{ a: 1 }], [{ a: 2 }])).toBe(false)
    })
  })
})
