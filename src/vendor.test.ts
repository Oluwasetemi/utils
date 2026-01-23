import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce, throttle } from './vendor'

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should throttle function calls', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should have a cancel method', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    expect(typeof throttled.cancel).toBe('function')
  })

  it('should cancel pending invocations', () => {
    const fn = vi.fn()
    const throttled = throttle(100, fn)

    throttled()
    throttled()
    throttled.cancel()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments to the throttled function', () => {
    const fn = vi.fn()
    const throttled = throttle<(a: number, b: string) => void>(100, fn)

    throttled(1, 'test')

    expect(fn).toHaveBeenCalledWith(1, 'test')
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should debounce function calls', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    debounced()
    debounced()
    debounced()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should have a cancel method', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    expect(typeof debounced.cancel).toBe('function')
  })

  it('should cancel pending invocations', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    debounced()
    debounced.cancel()

    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()
  })

  it('should pass arguments to the debounced function', () => {
    const fn = vi.fn()
    const debounced = debounce<(a: number, b: string) => void>(100, fn)

    debounced(1, 'test')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith(1, 'test')
  })

  it('should reset the timer on each call', () => {
    const fn = vi.fn()
    const debounced = debounce(100, fn)

    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(50)

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
