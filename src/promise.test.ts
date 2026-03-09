import { describe, expect, it } from 'vitest'
import { createControlledPromise, createPromiseLock, createSingletonPromise, sleep } from './promise'

describe('createPromiseLock', () => {
  it('should run async tasks and wait for them', async () => {
    const lock = createPromiseLock()
    let count = 0

    lock.run(async () => {
      await sleep(10)
      count += 1
    })

    expect(lock.isWaiting()).toBe(true)
    await lock.wait()
    expect(count).toBe(1)
    expect(lock.isWaiting()).toBe(false)
  })

  it('should return the result of the run function', async () => {
    const lock = createPromiseLock()
    const result = await lock.run(async () => 42)
    expect(result).toBe(42)
  })

  it('should clear all locks', async () => {
    const lock = createPromiseLock()
    lock.run(async () => {
      await sleep(50)
    })
    expect(lock.isWaiting()).toBe(true)
    lock.clear()
    expect(lock.isWaiting()).toBe(false)
  })

  it('should wait with no active locks immediately', async () => {
    const lock = createPromiseLock()
    await expect(lock.wait()).resolves.toBeUndefined()
  })
})

describe('createControlledPromise', () => {
  it('should resolve externally', async () => {
    const promise = createControlledPromise<string>()
    promise.resolve('hello')
    expect(await promise).toBe('hello')
  })

  it('should reject externally', async () => {
    const promise = createControlledPromise<string>()
    promise.reject(new Error('fail'))
    await expect(promise).rejects.toThrow('fail')
  })
})

it('sleep with callback', async () => {
  let called = false
  await sleep(10, () => {
    called = true
  })
  expect(called).toBe(true)
})

it('createSingletonPromise reset without prior call', async () => {
  const promise = createSingletonPromise(async () => 42)
  // reset() before any invocation — _prev is undefined, should not await
  await promise.reset()
  const result = await promise()
  expect(result).toBe(42)
})

it('promise', async () => {
  let dummy = 0

  const promise = createSingletonPromise(async () => {
    await sleep(10)
    dummy += 1
    return dummy
  })

  expect(dummy).toBe(0)

  await promise()

  expect(dummy).toBe(1)

  await promise()
  expect(await promise()).toBe(1)

  expect(dummy).toBe(1)

  await promise.reset()

  await promise()

  expect(dummy).toBe(2)
})
