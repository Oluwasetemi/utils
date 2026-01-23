import { describe, expect, it } from 'vitest'
import {
  isBoolean,
  isBrowser,
  isDate,
  isDef,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isPrimitive,
  isRegExp,
  isString,
  isUndefined,
  isWindow,
} from './is'

describe('isDef', () => {
  it('should return true for defined values', () => {
    expect(isDef(0)).toBe(true)
    expect(isDef('')).toBe(true)
    expect(isDef(false)).toBe(true)
    expect(isDef(null)).toBe(true)
  })

  it('should return false for undefined', () => {
    expect(isDef(undefined)).toBe(false)
  })
})

describe('isBoolean', () => {
  it('should return true for booleans', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
  })

  it('should return false for non-booleans', () => {
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean('')).toBe(false)
    expect(isBoolean(null)).toBe(false)
  })
})

describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(function () {})).toBe(true)
    expect(isFunction(async () => {})).toBe(true)
  })

  it('should return false for non-functions', () => {
    expect(isFunction({})).toBe(false)
    expect(isFunction(null)).toBe(false)
  })
})

describe('isNumber', () => {
  it('should return true for numbers', () => {
    expect(isNumber(0)).toBe(true)
    expect(isNumber(42)).toBe(true)
    expect(isNumber(-1)).toBe(true)
    expect(isNumber(3.14)).toBe(true)
    expect(isNumber(Number.NaN)).toBe(true)
    expect(isNumber(Number.POSITIVE_INFINITY)).toBe(true)
  })

  it('should return false for non-numbers', () => {
    expect(isNumber('42')).toBe(false)
    expect(isNumber(null)).toBe(false)
  })
})

describe('isString', () => {
  it('should return true for strings', () => {
    expect(isString('')).toBe(true)
    expect(isString('hello')).toBe(true)
  })

  it('should return false for non-strings', () => {
    expect(isString(42)).toBe(false)
    expect(isString(null)).toBe(false)
  })
})

describe('isObject', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
  })

  it('should return false for arrays and other non-plain objects', () => {
    expect(isObject([])).toBe(false) // arrays are not plain objects
    expect(isObject(new Date())).toBe(false) // Date is not a plain object
  })

  it('should return false for primitives and null', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject('string')).toBe(false)
  })
})

describe('isUndefined', () => {
  it('should return true for undefined', () => {
    expect(isUndefined(undefined)).toBe(true)
  })

  it('should return false for other values', () => {
    expect(isUndefined(null)).toBe(false)
    expect(isUndefined(0)).toBe(false)
  })
})

describe('isNull', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBe(true)
  })

  it('should return false for other values', () => {
    expect(isNull(undefined)).toBe(false)
    expect(isNull(0)).toBe(false)
  })
})

describe('isRegExp', () => {
  it('should return true for regex', () => {
    expect(isRegExp(/test/)).toBe(true)
    expect(isRegExp(new RegExp('test'))).toBe(true)
  })

  it('should return false for non-regex', () => {
    expect(isRegExp('test')).toBe(false)
    expect(isRegExp({})).toBe(false)
  })
})

describe('isDate', () => {
  it('should return true for Date objects', () => {
    expect(isDate(new Date())).toBe(true)
  })

  it('should return false for non-Date values', () => {
    expect(isDate('2023-01-01')).toBe(false)
    expect(isDate(Date.now())).toBe(false)
  })
})

describe('isPrimitive', () => {
  it('should return true for primitive values', () => {
    expect(isPrimitive(null)).toBe(true)
    expect(isPrimitive(undefined)).toBe(true)
    expect(isPrimitive(0)).toBe(true)
    expect(isPrimitive('')).toBe(true)
    expect(isPrimitive(Symbol('foo'))).toBe(true)
    expect(isPrimitive(1n)).toBe(true)
    expect(isPrimitive(true)).toBe(true)
  })

  it('should return false for objects', () => {
    expect(isPrimitive([])).toBe(false)
    expect(isPrimitive({})).toBe(false)

    class Foo {}
    expect(isPrimitive(new Foo())).toBe(false)
    expect(isPrimitive(new Map())).toBe(false)
  })
})

describe('isWindow', () => {
  it('should return false in non-browser environment', () => {
    expect(isWindow({})).toBe(false)
    expect(isWindow(null)).toBe(false)
  })
})

describe('isBrowser', () => {
  it('should be a boolean', () => {
    expect(typeof isBrowser).toBe('boolean')
  })
})
