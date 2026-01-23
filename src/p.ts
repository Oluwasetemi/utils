import pLimit from 'p-limit'

/**
 * Internal marker for filtered items
 */
const VOID = Symbol('p-void')

/**
 * Options for configuring PInstance behavior.
 *
 * @category Promise
 */
interface POptions {
  /**
   * How many promises are resolved at the same time.
   */
  concurrency?: number | undefined
}

/**
 * A Promise-based utility class for managing and transforming collections of promises.
 *
 * Provides chainable methods similar to Array methods but for async operations.
 * Supports concurrency limiting and lazy evaluation.
 *
 * @category Promise
 * @template T - The type of items in the collection
 */
class PInstance<T = any> extends Promise<Awaited<T>[]> {
  private promises = new Set<T | Promise<T>>()

  /**
   * Gets the resolved promise with all items filtered and processed.
   *
   * @returns A promise that resolves to an array of all resolved items
   */
  get promise(): Promise<Awaited<T>[]> {
    let batch
    const items = [...Array.from(this.items), ...Array.from(this.promises)]

    if (this.options?.concurrency) {
      const limit = pLimit(this.options.concurrency)
      batch = Promise.all(items.map(p => limit(() => p)))
    }
    else {
      batch = Promise.all(items)
    }

    return batch.then(l => l.filter((i: any) => i !== VOID))
  }

  constructor(public items: Iterable<T> = [], public options?: POptions) {
    super(() => {})
  }

  /**
   * Adds one or more items or promises to the collection.
   *
   * @param args - Items or promises to add
   * @example
   * ```ts
   * const instance = p([1, 2])
   * instance.add(Promise.resolve(3), 4)
   * ```
   */
  add(...args: (T | Promise<T>)[]) {
    args.forEach((i) => {
      this.promises.add(i)
    })
  }

  /**
   * Maps each resolved value to a new value using the provided function.
   *
   * @template U - The type of the mapped values
   * @param fn - The mapping function
   * @returns A new PInstance with mapped values
   * @example
   * ```ts
   * await p([1, 2, 3]).map(x => x * 2) // [2, 4, 6]
   * ```
   */
  map<U>(fn: (value: Awaited<T>, index: number) => U): PInstance<Promise<U>> {
    return new PInstance(
      Array.from(this.items)
        .map(async (i, idx) => {
          const v = await i
          if ((v as any) === VOID)
            return VOID as unknown as U
          return fn(v, idx)
        }),
      this.options,
    )
  }

  /**
   * Filters resolved values based on the provided predicate function.
   *
   * @param fn - The filter predicate function (can be async)
   * @returns A new PInstance with filtered values
   * @example
   * ```ts
   * await p([1, 2, 3, 4]).filter(x => x % 2 === 0) // [2, 4]
   * ```
   */
  filter(fn: (value: Awaited<T>, index: number) => boolean | Promise<boolean>): PInstance<Promise<T>> {
    return new PInstance(
      Array.from(this.items)
        .map(async (i, idx) => {
          const v = await i
          const r = await fn(v, idx)
          if (!r)
            return VOID as unknown as T
          return v
        }),
      this.options,
    )
  }

  /**
   * Executes a function for each resolved value.
   *
   * @param fn - The function to execute for each value
   * @returns A promise that resolves when all iterations complete
   * @example
   * ```ts
   * await p([1, 2, 3]).forEach(x => console.log(x))
   * ```
   */
  forEach(fn: (value: Awaited<T>, index: number) => void): Promise<void> {
    return this.map(fn).then()
  }

  /**
   * Reduces all resolved values to a single value.
   *
   * @template U - The type of the accumulated value
   * @param fn - The reducer function
   * @param initialValue - The initial value for the reduction
   * @returns A promise that resolves to the reduced value
   * @example
   * ```ts
   * await p([1, 2, 3]).reduce((acc, x) => acc + x, 0) // 6
   * ```
   */
  reduce<U>(fn: (previousValue: U, currentValue: Awaited<T>, currentIndex: number, array: Awaited<T>[]) => U, initialValue: U): Promise<U> {
    return this.promise.then(array => array.reduce(fn, initialValue))
  }

  /**
   * Clears all added promises from the collection.
   *
   * @example
   * ```ts
   * const instance = p([1, 2])
   * instance.add(3)
   * instance.clear() // Only [1, 2] remain
   * ```
   */
  clear() {
    this.promises.clear()
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   *
   * @template TResult1 - The type of the fulfilled result
   * @template TResult2 - The type of the rejected result
   * @param onfulfilled - The callback to execute when the Promise is resolved
   * @param onrejected - The callback to execute when the Promise is rejected
   * @returns A Promise for the completion of which ever callback is executed
   */
  then<TResult1 = Awaited<T>[], TResult2 = never>(
    onfulfilled?: ((value: Awaited<T>[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.promise.then(onfulfilled, onrejected)
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   *
   * @param fn - The callback to execute when the Promise is rejected
   * @returns A Promise for the completion of the callback
   */
  catch(fn?: (err: unknown) => PromiseLike<any>) {
    return this.promise.catch(fn)
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected).
   *
   * @param fn - The callback to execute when the Promise is settled
   * @returns A Promise for the completion of the callback
   */
  finally(fn?: () => void) {
    return this.promise.finally(fn)
  }
}

/**
 * Utility for managing multiple promises.
 *
 * @see https://github.com/oluwasetemi/utils/tree/main/docs/p.md
 * @category Promise
 * @example
 * ```
 * import { p } from '@setemiojo/utils'
 *
 * const items = [1, 2, 3, 4, 5]
 *
 * await p(items)
 *   .map(async i => await multiply(i, 3))
 *   .filter(async i => await isEven(i))
 * // [6, 12]
 * ```
 */
export function p<T = any>(items?: Iterable<T>, options?: POptions): PInstance<T> {
  return new PInstance(items, options)
}
