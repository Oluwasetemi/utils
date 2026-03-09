import { describe, expect, it } from 'vitest'
import { clearUndefined, deepMerge, deepMergeWithArray, hasOwnProperty, isKeyOf, objectEntries, objectId, objectKeys, objectMap, objectOmit, objectPick } from './object'

it('objectMap', () => {
  expect(objectMap({}, (...args) => args)).toEqual({})

  expect(
    objectMap(
      { a: 1, b: 2 },
      (k, v) => [k.toString().toUpperCase(), v.toString()],
    ),
  ).toEqual({ A: '1', B: '2' })

  expect(
    objectMap(
      { a: 1, b: 2 },
      () => undefined,
    ),
  ).toEqual({})

  expect(
    objectMap(
      { a: 1, b: 2 },
      (k, v) => k === 'a' ? undefined : [k, v],
    ),
  ).toEqual({ b: 2 })

  expect(
    objectMap(
      { a: 1, b: 2 },
      (k, v) => [v, k],
    ),
  ).toEqual({ 1: 'a', 2: 'b' })
})

describe('deepMerge', () => {
  it('should merge Objects and all nested Ones', () => {
    const obj1 = { a: { a1: 'A1' }, c: 'C', d: {} }
    const obj2 = { a: { a2: 'A2' }, b: { b1: 'B1' }, d: null } as any
    const obj3 = { a: { a1: 'A1', a2: 'A2' }, b: { b1: 'B1' }, c: 'C', d: null }
    expect(deepMerge({}, obj1, obj2)).toEqual(obj3)
  })
  it('should behave like Object.assign on the top level', () => {
    const obj1 = { a: { a1: 'A1' }, c: 'C' }
    const obj2 = { a: undefined, b: { b1: 'B1' } }
    const merged = deepMerge(obj1, obj2)
    expect(merged).toEqual(Object.assign({}, obj1, obj2))
  })
  it('should not merge array values, just override', () => {
    const obj1 = { a: ['A', 'B'] }
    const obj2 = { a: ['C'], b: ['D'] }
    expect(deepMerge({}, obj1, obj2)).toEqual({ a: ['C'], b: ['D'] })
  })
  it('should overide plain value', () => {
    const obj1 = { a: { x: 1 } }
    const obj2 = { a: { x: { f: 2 } } } as any
    expect(deepMerge({}, obj1, obj2)).toEqual({ a: { x: { f: 2 } } })
  })

  it('prototype pollution 1', () => {
    const obj = {} as any
    const obj2 = {} as any
    const payload = JSON.parse('{"__proto__":{"polluted":"Polluted!"}}')

    expect(obj.polluted).toBeUndefined()
    expect(obj2.polluted).toBeUndefined()
    deepMerge(obj, payload)
    expect(obj.polluted).toBeUndefined()
    expect(obj2.polluted).toBeUndefined()
  })
})

describe('deepMergeWithArray', () => {
  it('should merge array values', () => {
    const obj1 = { a: ['A', 'B'] }
    const obj2 = { a: ['C'], b: ['D'] }
    expect(deepMergeWithArray({}, obj1, obj2)).toEqual({ a: ['A', 'B', 'C'], b: ['D'] })
  })
})

it('isKeyOf', () => {
  const obj = { a: 1, b: 2 }
  expect(isKeyOf(obj, 'a')).toBe(true)
  expect(isKeyOf(obj, 'c')).toBe(false)
})

it('objectKeys', () => {
  expect(objectKeys({ a: 1, b: 2 })).toEqual(['a', 'b'])
  expect(objectKeys({})).toEqual([])
})

it('objectEntries', () => {
  expect(objectEntries({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]])
  expect(objectEntries({})).toEqual([])
})

it('objectPick', () => {
  const obj = { a: 1, b: 2, c: 3 }
  expect(objectPick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  expect(objectPick(obj, [])).toEqual({})
  const obj2 = { a: 1, b: undefined as any }
  expect(objectPick(obj2, ['a', 'b'], true)).toEqual({ a: 1 })
  expect(objectPick(obj2, ['a', 'b'], false)).toEqual({ a: 1, b: undefined })
})

it('objectOmit', () => {
  const obj = { a: 1, b: 2, c: 3 }
  expect(objectOmit(obj, ['b'])).toEqual({ a: 1, c: 3 })
  expect(objectOmit(obj, [])).toEqual({ a: 1, b: 2, c: 3 })
  const obj2 = { a: 1, b: 2, c: undefined as any }
  expect(objectOmit(obj2, ['b'], true)).toEqual({ a: 1 })
})

it('clearUndefined', () => {
  const obj = { a: 1, b: undefined, c: 3 }
  expect(clearUndefined(obj)).toEqual({ a: 1, c: 3 })
  expect(clearUndefined({})).toEqual({})
})

it('hasOwnProperty', () => {
  expect(hasOwnProperty({ a: 1 }, 'a')).toBe(true)
  expect(hasOwnProperty({ a: 1 }, 'b')).toBe(false)
  expect(hasOwnProperty({ a: 1 }, 'toString')).toBe(false)
  expect(hasOwnProperty(null, 'a')).toBe(false)
  expect(hasOwnProperty(undefined, 'a')).toBe(false)
})

it('objectId', () => {
  const foo = { a: 1, b: 2 }
  const bar = new Map()
  // eslint-disable-next-line prefer-regex-literals
  const baz = new RegExp('foo', 'g')

  expect(objectId(foo)).toBe(objectId(foo))
  expect(objectId(bar)).toBe(objectId(bar))
  expect(objectId(baz)).toBe(objectId(baz))

  expect(objectId(foo)).not.toBe(objectId(bar))
  expect(objectId({})).not.toBe(objectId({}))
  expect(objectId([])).not.toBe(objectId([]))
  expect(objectId(/a/)).not.toBe(objectId(/a/))
})

describe('deepMergeWithArray (additional)', () => {
  it('should merge nested objects within arrays context', () => {
    const obj1: any = { a: { x: 1 }, b: [1] }
    const obj2: any = { a: { y: 2 }, b: [2] }
    expect(deepMergeWithArray({} as any, obj1, obj2)).toEqual({ a: { x: 1, y: 2 }, b: [1, 2] })
  })

  it('should handle empty sources', () => {
    const obj = { a: 1 }
    expect(deepMergeWithArray(obj)).toEqual({ a: 1 })
  })
})
