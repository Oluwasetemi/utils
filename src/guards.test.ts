import { describe, expect, it } from 'vitest'
import { isTruthy, noNull, notNullish, notUndefined } from './guards'

describe('notNullish', () => {
  it('should return true for non-null/undefined values', () => {
    expect(notNullish(0)).toBe(true)
    expect(notNullish('')).toBe(true)
    expect(notNullish(false)).toBe(true)
    expect(notNullish(1)).toBe(true)
    expect(notNullish('hello')).toBe(true)
    expect(notNullish({})).toBe(true)
    expect(notNullish([])).toBe(true)
  })

  it('should return false for null', () => {
    expect(notNullish(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(notNullish(undefined)).toBe(false)
  })

  it('should work as array filter', () => {
    const arr = [1, null, 2, undefined, 3]
    const filtered = arr.filter(notNullish)
    expect(filtered).toEqual([1, 2, 3])
  })
})

describe('noNull', () => {
  it('should return true for non-null values', () => {
    expect(noNull(0)).toBe(true)
    expect(noNull('')).toBe(true)
    expect(noNull(false)).toBe(true)
    expect(noNull(undefined)).toBe(true)
    expect(noNull(1)).toBe(true)
    expect(noNull('hello')).toBe(true)
  })

  it('should return false for null', () => {
    expect(noNull(null)).toBe(false)
  })

  it('should work as array filter', () => {
    const arr = [1, null, 2, null, 3]
    const filtered = arr.filter(noNull)
    expect(filtered).toEqual([1, 2, 3])
  })
})

describe('notUndefined', () => {
  it('should return true for non-undefined values', () => {
    expect(notUndefined(0)).toBe(true)
    expect(notUndefined('')).toBe(true)
    expect(notUndefined(false)).toBe(true)
    expect(notUndefined(null)).toBe(true)
    expect(notUndefined(1)).toBe(true)
    expect(notUndefined('hello')).toBe(true)
  })

  it('should return false for undefined', () => {
    expect(notUndefined(undefined)).toBe(false)
  })

  it('should work as array filter', () => {
    const arr = [1, undefined, 2, undefined, 3]
    const filtered = arr.filter(notUndefined)
    expect(filtered).toEqual([1, 2, 3])
  })
})

describe('isTruthy', () => {
  it('should return true for truthy values', () => {
    expect(isTruthy(1)).toBe(true)
    expect(isTruthy('hello')).toBe(true)
    expect(isTruthy(true)).toBe(true)
    expect(isTruthy({})).toBe(true)
    expect(isTruthy([])).toBe(true)
    expect(isTruthy(-1)).toBe(true)
    expect(isTruthy('0')).toBe(true)
  })

  it('should return false for falsy values', () => {
    expect(isTruthy(0)).toBe(false)
    expect(isTruthy('')).toBe(false)
    expect(isTruthy(false)).toBe(false)
    expect(isTruthy(null)).toBe(false)
    expect(isTruthy(undefined)).toBe(false)
    expect(isTruthy(Number.NaN)).toBe(false)
  })

  it('should work as array filter', () => {
    const arr = [0, 1, '', 'hello', null, true, false, undefined]
    const filtered = arr.filter(isTruthy)
    expect(filtered).toEqual([1, 'hello', true])
  })
})
