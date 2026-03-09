import { describe, expect, expectTypeOf, it } from 'vitest'
import { p as P } from './p'

const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('should', () => {
  it('p', async () => {
    const p = P()
    let dummy = 0
    p.add((async () => {
      await timeout(100)
      dummy += 1
      return 4
    })())
    expect(dummy).toBe(0)
    await p
    expect(dummy).toBe(1)
  })

  it('chain array map', async () => {
    expect(
      await P([1, 2, 3, 4, 5])
        .map(async (i) => {
          await timeout(10)
          return i * i
        })
        .filter(i => i > 10)
        .reduce((a, b) => a + b, 0),
    )
      .toEqual(41)
  })

  it('concurrency: 1', async () => {
    let running = 0

    const promises = Array.from({ length: 100 }, async (_, i: number) => {
      running++
      expect(running).to.be.lessThanOrEqual(1)
      running--
      return i
    })

    const results = await P(promises, { concurrency: 1 }).reduce((a, b) => a + b, 0)
    expect(results).to.be.equal(4950)
  })

  it('concurrency: 4', async () => {
    let running = 0

    const promises = Array.from({ length: 100 }, async () => {
      running++
      expect(running).to.be.lessThanOrEqual(4)
      running--
    })

    await P(promises, { concurrency: 4 })
  })

  it('fails with wrong format', async () => {
    try {
      await P([], { concurrency: 1.5 })
    }
    catch (e) {
      expect(e).toBeInstanceOf(TypeError)
    }

    try {
      await P([], { concurrency: 0 })
    }
    catch (e) {
      expect(e).toBeInstanceOf(TypeError)
    }
  })

  it('should return the correct type', async () => {
    const p = P([1, 2, 3])
    expectTypeOf(await p).toEqualTypeOf<number[]>()
    // @see issue #47
    expectTypeOf(await p.map(async i => i).map(async i => i)).toEqualTypeOf<number[]>()
  })

  it('forEach', async () => {
    const results: number[] = []
    await P([1, 2, 3]).forEach(x => results.push(x * 2))
    expect(results).toEqual([2, 4, 6])
  })

  it('clear', async () => {
    const instance = P([1, 2])
    instance.add(Promise.resolve(3))
    instance.clear()
    const result = await instance
    expect(result).toEqual([1, 2])
  })

  it('catch', async () => {
    const instance = P([Promise.reject(new Error('oops'))])
    await expect(instance.catch(e => `caught: ${(e as Error).message}`)).resolves.toBe('caught: oops')
  })

  it('finally', async () => {
    let called = false
    await P([1, 2]).finally(() => {
      called = true
    })
    expect(called).toBe(true)
  })

  it('map with filtered VOID items (filter then map)', async () => {
    const result = await P([1, 2, 3, 4])
      .filter(i => i % 2 === 0)
      .map(i => i * 10)
    expect(result).toEqual([20, 40])
  })
})
