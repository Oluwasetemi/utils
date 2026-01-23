import { describe, expect, it } from 'vitest'
import { assert, getTypeName, noop, toString } from './base'

describe('assert', () => {
  it('should not throw when condition is true', () => {
    expect(() => assert(true, 'should not throw')).not.toThrow()
  })

  it('should throw when condition is false', () => {
    expect(() => assert(false, 'error message')).toThrow('error message')
  })

  it('should throw with the provided message', () => {
    expect(() => assert(false, 'custom error')).toThrow('custom error')
  })
})

describe('toString', () => {
  it('should return [object Object] for plain objects', () => {
    expect(toString({})).toBe('[object Object]')
  })

  it('should return [object Array] for arrays', () => {
    expect(toString([])).toBe('[object Array]')
  })

  it('should return [object Null] for null', () => {
    expect(toString(null)).toBe('[object Null]')
  })

  it('should return [object Undefined] for undefined', () => {
    expect(toString(undefined)).toBe('[object Undefined]')
  })

  it('should return [object Number] for numbers', () => {
    expect(toString(42)).toBe('[object Number]')
  })

  it('should return [object String] for strings', () => {
    expect(toString('hello')).toBe('[object String]')
  })

  it('should return [object Function] for functions', () => {
    expect(toString(() => {})).toBe('[object Function]')
  })

  it('should return [object Date] for dates', () => {
    expect(toString(new Date())).toBe('[object Date]')
  })

  it('should return [object RegExp] for regular expressions', () => {
    expect(toString(/test/)).toBe('[object RegExp]')
  })
})

describe('getTypeName', () => {
  it('should return "null" for null', () => {
    expect(getTypeName(null)).toBe('null')
  })

  it('should return "object" for plain objects', () => {
    expect(getTypeName({})).toBe('object')
  })

  it('should return "array" for arrays', () => {
    expect(getTypeName([])).toBe('array')
  })

  it('should return "number" for numbers', () => {
    expect(getTypeName(42)).toBe('number')
  })

  it('should return "string" for strings', () => {
    expect(getTypeName('hello')).toBe('string')
  })

  it('should return "boolean" for booleans', () => {
    expect(getTypeName(true)).toBe('boolean')
    expect(getTypeName(false)).toBe('boolean')
  })

  it('should return "undefined" for undefined', () => {
    expect(getTypeName(undefined)).toBe('undefined')
  })

  it('should return "function" for functions', () => {
    expect(getTypeName(() => {})).toBe('function')
  })

  it('should return "date" for dates', () => {
    expect(getTypeName(new Date())).toBe('date')
  })

  it('should return "regexp" for regular expressions', () => {
    expect(getTypeName(/test/)).toBe('regexp')
  })

  it('should return "symbol" for symbols', () => {
    expect(getTypeName(Symbol('test'))).toBe('symbol')
  })

  it('should return "bigint" for bigints', () => {
    expect(getTypeName(BigInt(123))).toBe('bigint')
  })
})

describe('noop', () => {
  it('should be a function', () => {
    expect(typeof noop).toBe('function')
  })

  it('should return undefined', () => {
    expect(noop()).toBeUndefined()
  })

  it('should not throw', () => {
    expect(() => noop()).not.toThrow()
  })
})
