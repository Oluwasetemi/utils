import { describe, expect, it, vi } from 'vitest'
import { batchInvoke, invoke, tap } from './function'

describe('batchInvoke', () => {
  it('should call all functions in array', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const fn3 = vi.fn()

    batchInvoke([fn1, fn2, fn3])

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(fn3).toHaveBeenCalledTimes(1)
  })

  it('should skip null and undefined functions', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()

    batchInvoke([fn1, null, fn2, undefined])

    expect(fn1).toHaveBeenCalledTimes(1)
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  it('should handle empty array', () => {
    expect(() => batchInvoke([])).not.toThrow()
  })
})

describe('invoke', () => {
  it('should call function and return result', () => {
    const result = invoke(() => 42)
    expect(result).toBe(42)
  })

  it('should work with complex return values', () => {
    const result = invoke(() => ({ a: 1, b: 2 }))
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should work with IIFE pattern', () => {
    const result = invoke(() => {
      const a = 1
      const b = 2
      return a + b
    })
    expect(result).toBe(3)
  })
})

describe('tap', () => {
  it('should return the original value', () => {
    expect(tap(1, () => {})).toEqual(1)
  })

  it('should call callback with value', () => {
    const callback = vi.fn()
    tap(42, callback)
    expect(callback).toHaveBeenCalledWith(42)
  })

  it('should allow mutation of objects', () => {
    expect(tap({ a: 1 }, obj => obj.a++)).toEqual({ a: 2 })
  })

  it('should work for side effects', () => {
    const logs: number[] = []
    const result = tap(5, v => logs.push(v))
    expect(result).toBe(5)
    expect(logs).toEqual([5])
  })
})
