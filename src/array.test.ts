import { describe, expect, it } from 'vitest'
import { at, clampArrayRange, filterInPlace, flattenArrayable, groupBy, last, mergeArrayable, move, partition, range, remove, sample, shuffle, toArray, uniqueBy } from './array'

describe('toArray', () => {
  it.each([
    [undefined, []],
    [null, []],
    [false, [false]],
    [0, [0]],
    ['', ['']],
    [[], []],
    ['foo', ['foo']],
    [['foo'], ['foo']],
  ])('%s => %s', (input, expected) => {
    expect(toArray(input)).toEqual(expected)
  })
})

it('flattenArrayable', () => {
  expect(flattenArrayable()).toEqual([])
  expect(flattenArrayable([])).toEqual([])
  expect(flattenArrayable(1)).toEqual([1])
  expect(flattenArrayable([1, '2', 3])).toEqual([1, '2', 3])
  expect(flattenArrayable([1, [1, 2]])).toEqual([1, 1, 2])
  expect(flattenArrayable([1, [1, [2]]])).toEqual([1, 1, [2]])
})

it('range', () => {
  expect(range(0)).toEqual([])
  expect(range(2)).toEqual([0, 1])
  expect(range(2, 5)).toEqual([2, 3, 4])
  expect(range(2, 10, 2)).toEqual([2, 4, 6, 8])
})

it('partition', () => {
  const data = range(10)

  expect(
    partition(data, i => i % 2),
  ).toEqual([
    [1, 3, 5, 7, 9],
    [0, 2, 4, 6, 8],
  ])

  expect(
    partition(
      data,
      i => i % 3 === 0,
      i => i % 2 === 0,
    ),
  ).toEqual([
    [0, 3, 6, 9],
    [2, 4, 8],
    [1, 5, 7],
  ])

  expect(
    partition(
      data,
      i => i,
    ),
  ).toHaveLength(2)

  expect(
    partition(
      data,
      i => i,
      i => i,
      i => i,
      i => i,
      i => i,
    ),
  ).toHaveLength(6)
})

it('filterInPlace', () => {
  const data = range(10)
  const result = filterInPlace(data, i => i % 2)
  expect(data).toEqual([1, 3, 5, 7, 9])
  expect(data).toBe(result)
})

it('groupBy', () => {
  const data = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 1, name: 'Johnny' }]
  const result = groupBy(data, 'id')
  expect(result).toEqual({ 1: [{ id: 1, name: 'John' }, { id: 1, name: 'Johnny' }], 2: [{ id: 2, name: 'Jane' }] })
})

it('mergeArrayable', () => {
  expect(mergeArrayable()).toEqual([])
  expect(mergeArrayable(1, 2)).toEqual([1, 2])
  expect(mergeArrayable([1, 2], [3, 4])).toEqual([1, 2, 3, 4])
  expect(mergeArrayable(1, null, [2, 3])).toEqual([1, 2, 3])
  expect(mergeArrayable([1], undefined, [2])).toEqual([1, 2])
})

it('uniqueBy', () => {
  const users = [{ id: 1 }, { id: 2 }, { id: 1 }]
  expect(uniqueBy(users, (a, b) => a.id === b.id)).toEqual([{ id: 1 }, { id: 2 }])
  expect(uniqueBy([], (a, b) => a === b)).toEqual([])
  expect(uniqueBy([1, 2, 2, 3], (a, b) => a === b)).toEqual([1, 2, 3])
})

it('last', () => {
  expect(last([1, 2, 3])).toBe(3)
  expect(last(['a', 'b'])).toBe('b')
  expect(last([])).toBeUndefined()
})

it('remove', () => {
  const arr = [1, 2, 3, 2]
  expect(remove(arr, 2)).toBe(true)
  expect(arr).toEqual([1, 3, 2])
  expect(remove(arr, 5)).toBe(false)
  expect(arr).toEqual([1, 3, 2])
})

it('at', () => {
  expect(at([1, 2, 3], 0)).toBe(1)
  expect(at([1, 2, 3], -1)).toBe(3)
  expect(at([1, 2, 3], -2)).toBe(2)
  expect(at([], 0)).toBeUndefined()
  expect(at([1, 2, 3], 5)).toBeUndefined()
})

it('range with step 0', () => {
  expect(range(0, 10, 0)).toEqual([])
})

it('range with negative step', () => {
  expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1])
})

it('move', () => {
  const arr = ['a', 'b', 'c', 'd']
  expect(move(arr, 0, 2)).toEqual(['b', 'c', 'a', 'd'])
})

it('clampArrayRange', () => {
  expect(clampArrayRange(-5, [1, 2, 3])).toBe(0)
  expect(clampArrayRange(1, [1, 2, 3])).toBe(1)
  expect(clampArrayRange(10, [1, 2, 3])).toBe(2)
})

it('sample', () => {
  const arr = [1, 2, 3, 4, 5]
  const result = sample(arr, 3)
  expect(result).toHaveLength(3)
  result.forEach(item => expect(arr).toContain(item))
  expect(sample([], 3)).toEqual([])
})

it('shuffle', () => {
  const arr = [1, 2, 3, 4, 5]
  const copy = [...arr]
  const shuffled = shuffle(arr)
  expect(shuffled).toBe(arr)
  expect(shuffled).toHaveLength(5)
  expect(shuffled.sort()).toEqual(copy.sort())
})
