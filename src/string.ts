import { isObject } from './is'

/**
 * Replace backslashes with forward slashes.
 *
 * Useful for normalizing Windows paths.
 *
 * @category String
 * @param str - The string to process
 * @returns The string with backslashes replaced by forward slashes
 * @example
 * ```ts
 * slash('C:\\Users\\name') // 'C:/Users/name'
 * slash('path\\to\\file.ts') // 'path/to/file.ts'
 * ```
 */
export function slash(str: string) {
  return str.replace(/\\/g, '/')
}

/**
 * Ensure a string starts with a given prefix.
 *
 * @category String
 * @param prefix - The prefix to ensure
 * @param str - The string to check
 * @returns The string with the prefix prepended if it wasn't already present
 * @example
 * ```ts
 * ensurePrefix('/', 'path') // '/path'
 * ensurePrefix('/', '/path') // '/path' (unchanged)
 * ensurePrefix('https://', 'example.com') // 'https://example.com'
 * ```
 */
export function ensurePrefix(prefix: string, str: string) {
  if (!str.startsWith(prefix))
    return prefix + str
  return str
}

/**
 * Ensure a string ends with a given suffix.
 *
 * @category String
 * @param suffix - The suffix to ensure
 * @param str - The string to check
 * @returns The string with the suffix appended if it wasn't already present
 * @example
 * ```ts
 * ensureSuffix('/', 'path') // 'path/'
 * ensureSuffix('/', 'path/') // 'path/' (unchanged)
 * ensureSuffix('.js', 'script') // 'script.js'
 * ```
 */
export function ensureSuffix(suffix: string, str: string) {
  if (!str.endsWith(suffix))
    return str + suffix
  return str
}

/**
 * Simple template engine with object-based placeholders.
 *
 * Replaces `{key}` placeholders with values from the provided object.
 * A fallback value can be provided for missing keys.
 *
 * @category String
 * @param str - The template string with `{key}` placeholders
 * @param object - Object with key-value pairs to replace placeholders
 * @param fallback - Optional fallback value or function for missing keys
 * @returns The formatted string
 * @example
 * ```ts
 * template('{greet}! My name is {name}.', { greet: 'Hello', name: 'Anthony' })
 * // 'Hello! My name is Anthony.'
 *
 * // With string fallback
 * template('{greet}! My name is {name}.', { greet: 'Hello' }, 'unknown')
 * // 'Hello! My name is unknown.'
 *
 * // With function fallback
 * template('{greet}! My name is {name}.', { greet: 'Hello' }, (key) => `[${key}]`)
 * // 'Hello! My name is [name].'
 * ```
 */
export function template(str: string, object: Record<string | number, any>, fallback?: string | ((key: string) => string)): string
/**
 * Simple template engine with index-based placeholders.
 *
 * Replaces `{0}`, `{1}`, etc. placeholders with the provided arguments.
 *
 * @category String
 * @param str - The template string with `{0}`, `{1}`, etc. placeholders
 * @param args - Values to replace placeholders by index
 * @returns The formatted string
 * @example
 * ```ts
 * template('Hello {0}! My name is {1}.', 'Inès', 'Anthony')
 * // 'Hello Inès! My name is Anthony.'
 *
 * template('The answer is {0}.', 42)
 * // 'The answer is 42.'
 * ```
 */
export function template(str: string, ...args: (string | number | bigint | undefined | null)[]): string
export function template(str: string, ...args: any[]): string {
  const [firstArg, fallback] = args

  if (isObject(firstArg)) {
    const vars = firstArg as Record<string, any>
    return str.replace(/\{(\w+)\}/g, (_, key) => vars[key] || ((typeof fallback === 'function' ? fallback(key) : fallback) ?? key))
  }
  else {
    return str.replace(/\{(\d+)\}/g, (_, key) => {
      const index = Number(key)
      if (Number.isNaN(index))
        return key
      return args[index]
    })
  }
}

// port from nanoid
// https://github.com/ai/nanoid
const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
/**
 * Generate a random string.
 *
 * Uses a URL-safe alphabet by default (similar to nanoid).
 *
 * @category String
 * @param size - Length of the random string (default: 16)
 * @param dict - Character set to use (default: URL-safe alphabet)
 * @returns A random string of the specified length
 * @example
 * ```ts
 * randomStr() // e.g., 'V1StGXR8_Z5jdHi6'
 * randomStr(8) // e.g., 'V1StGXR8'
 * randomStr(4, 'abc') // e.g., 'abca'
 * ```
 */
export function randomStr(size = 16, dict = urlAlphabet) {
  let id = ''
  let i = size
  const len = dict.length
  while (i--)
    id += dict[(Math.random() * len) | 0]
  return id
}

/**
 * Capitalize a string: first letter uppercase, rest lowercase.
 *
 * @category String
 * @param str - The string to capitalize
 * @returns The capitalized string
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * capitalize('HELLO') // 'Hello'
 * capitalize('hELLO wORLD') // 'Hello world'
 * ```
 */
export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}

const _reFullWs = /^\s*$/

/**
 * Remove common leading whitespace from a template string.
 *
 * Also removes empty lines at the beginning and end.
 * Useful for writing indented multi-line strings in code.
 *
 * @category String
 * @param str - The template string or string to unindent
 * @returns The unindented string
 * @example
 * ```ts
 * const str = unindent`
 *   if (a) {
 *     b()
 *   }
 * `
 * // Result:
 * // 'if (a) {\n  b()\n}'
 * ```
 */
export function unindent(str: TemplateStringsArray | string) {
  const lines = (typeof str === 'string' ? str : str[0]).split('\n')
  const whitespaceLines = lines.map(line => _reFullWs.test(line))

  const commonIndent = lines
    .reduce((min, line, idx) => {
      if (whitespaceLines[idx])
        return min
      const indent = line.match(/^\s*/)?.[0].length
      return indent === undefined ? min : Math.min(min, indent)
    }, Number.POSITIVE_INFINITY)

  let emptyLinesHead = 0
  while (emptyLinesHead < lines.length && whitespaceLines[emptyLinesHead])
    emptyLinesHead++
  let emptyLinesTail = 0
  while (emptyLinesTail < lines.length && whitespaceLines[lines.length - emptyLinesTail - 1])
    emptyLinesTail++

  return lines
    .slice(emptyLinesHead, lines.length - emptyLinesTail)
    .map(line => line.slice(commonIndent))
    .join('\n')
}
