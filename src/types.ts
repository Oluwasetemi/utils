/**
 * A value that may be a Promise or a plain value.
 *
 * Useful for functions that can accept either sync or async values.
 *
 * @category Types
 * @example
 * ```ts
 * async function process(value: Awaitable<string>) {
 *   const result = await value
 *   return result.toUpperCase()
 * }
 * process('hello') // Works
 * process(Promise.resolve('hello')) // Also works
 * ```
 */
export type Awaitable<T> = T | PromiseLike<T>

/**
 * A value that may be null or undefined.
 *
 * @category Types
 * @example
 * ```ts
 * function greet(name: Nullable<string>) {
 *   return name ? `Hello, ${name}` : 'Hello, stranger'
 * }
 * ```
 */
export type Nullable<T> = T | null | undefined

/**
 * A value that may be a single item or an array of items.
 *
 * @category Types
 * @example
 * ```ts
 * function process(input: Arrayable<string>) {
 *   const items = Array.isArray(input) ? input : [input]
 *   return items.map(s => s.toUpperCase())
 * }
 * process('hello') // ['HELLO']
 * process(['hello', 'world']) // ['HELLO', 'WORLD']
 * ```
 */
export type Arrayable<T> = T | Array<T>

/**
 * A function type with a return type.
 *
 * @category Types
 * @example
 * ```ts
 * const callbacks: Fn<void>[] = []
 * const getters: Fn<number>[] = []
 * ```
 */
export type Fn<T = void> = () => T

/**
 * A constructor type.
 *
 * @category Types
 * @example
 * ```ts
 * function createInstance<T>(ctor: Constructor<T>): T {
 *   return new ctor()
 * }
 * ```
 */
export type Constructor<T = void> = new (...args: any[]) => T

/**
 * Infers the element type of an array.
 *
 * @category Types
 * @example
 * ```ts
 * type Item = ElementOf<string[]> // string
 * type Num = ElementOf<number[]> // number
 * ```
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never

/**
 * Converts a union type to an intersection type.
 *
 * @category Types
 * @see https://stackoverflow.com/a/50375286/9259330
 * @example
 * ```ts
 * type Union = { a: string } | { b: number }
 * type Intersection = UnionToIntersection<Union>
 * // { a: string } & { b: number }
 * ```
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

/**
 * Infers the argument types of a function as a tuple.
 *
 * @category Types
 * @example
 * ```ts
 * function greet(name: string, age: number) {}
 * type Args = ArgumentsType<typeof greet> // [string, number]
 * ```
 */
export type ArgumentsType<T> = T extends ((...args: infer A) => any) ? A : never

/**
 * Recursively simplifies an intersection type for better readability.
 *
 * @category Types
 */
export type MergeInsertions<T>
  = T extends (...args: any[]) => any
    ? T
    : T extends readonly any[]
      ? T
      : T extends object
        ? { [K in keyof T]: MergeInsertions<T[K]> }
        : T

/**
 * Deeply merges two object types.
 *
 * Properties from the second type override those from the first.
 *
 * @category Types
 * @example
 * ```ts
 * type A = { a: string, b: { c: number } }
 * type B = { b: { d: boolean }, e: string }
 * type Merged = DeepMerge<A, B>
 * // { a: string, b: { c: number, d: boolean }, e: string }
 * ```
 */
export type DeepMerge<F, S> = MergeInsertions<{
  [K in keyof F | keyof S]: K extends keyof S & keyof F
    ? DeepMerge<F[K], S[K]>
    : K extends keyof S
      ? S[K]
      : K extends keyof F
        ? F[K]
        : never;
}>
