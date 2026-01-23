import { flattenArrayable } from './array'

/**
 * Clamps a number within the inclusive range specified by min and max.
 *
 * @category Math
 * @param n - The number to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value between min and max
 * @example
 * ```ts
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 * ```
 */
export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/**
 * Calculates the sum of all provided numbers.
 *
 * @category Math
 * @param args - Numbers or arrays of numbers to sum
 * @returns The sum of all numbers
 * @example
 * ```ts
 * sum(1, 2, 3) // 6
 * sum([1, 2], [3, 4]) // 10
 * sum(1, [2, 3], 4) // 10
 * ```
 */
export function sum(...args: number[] | number[][]) {
  return flattenArrayable(args).reduce((a, b) => a + b, 0)
}

/**
 * Linearly interpolates between `min` and `max` based on `t`
 *
 * @category Math
 * @param min The minimum value
 * @param max The maximum value
 * @param t The interpolation value clamped between 0 and 1
 * @example
 * ```
 * const value = lerp(0, 2, 0.5) // value will be 1
 * ```
 */
export function lerp(min: number, max: number, t: number) {
  const interpolation = clamp(t, 0.0, 1.0)
  return min + (max - min) * interpolation
}

/**
 * Linearly remaps a clamped value from its source range [`inMin`, `inMax`] to the destination range [`outMin`, `outMax`]
 *
 * @category Math
 * @example
 * ```
 * const value = remap(0.5, 0, 1, 200, 400) // value will be 300
 * ```
 */
export function remap(n: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const interpolation = (n - inMin) / (inMax - inMin)
  return lerp(outMin, outMax, interpolation)
}
