# Is

Type checking utilities for runtime type validation.

## Basic Type Checks

### isDef

Check if a value is defined (not undefined)

```ts
import { isDef } from '@setemiojo/utils'

isDef(42) // true
isDef('hello') // true
isDef(null) // true
isDef(undefined) // false

// Type narrowing
function processValue(value: string | undefined) {
  if (isDef(value)) {
    // value is now typed as string
    return value.toUpperCase()
  }
  return 'default'
}
```

### isUndefined

Check if a value is undefined

```ts
import { isUndefined } from '@setemiojo/utils'

isUndefined(42) // false
isUndefined('hello') // false
isUndefined(null) // false
isUndefined(undefined) // true
```

### isNull

Check if a value is null

```ts
import { isNull } from '@setemiojo/utils'

isNull(42) // false
isNull('hello') // false
isNull(null) // true
isNull(undefined) // false
```

### isBoolean

Check if a value is a boolean

```ts
import { isBoolean } from '@setemiojo/utils'

isBoolean(true) // true
isBoolean(false) // true
isBoolean(0) // false
isBoolean('true') // false
isBoolean(null) // false
```

### isNumber

Check if a value is a number

```ts
import { isNumber } from '@setemiojo/utils'

isNumber(42) // true
isNumber(3.14) // true
isNumber(NaN) // true
isNumber(Infinity) // true
isNumber('42') // false
isNumber(null) // false
```

### isString

Check if a value is a string

```ts
import { isString } from '@setemiojo/utils'

isString('hello') // true
isString('') // true
isString(42) // false
isString(null) // false
isString(undefined) // false
```

### isFunction

Check if a value is a function

```ts
import { isFunction } from '@setemiojo/utils'

isFunction(() => {}) // true
isFunction(function() {}) // true
isFunction(class {}) // true
isFunction('function') // false
isFunction(null) // false
```

### isObject

Check if a value is a plain object

```ts
import { isObject } from '@setemiojo/utils'

isObject({}) // true
isObject({ name: 'John' }) // true
isObject([]) // false (arrays are not plain objects)
isObject(null) // false
isObject(new Date()) // false (Date objects are not plain objects)
isObject('string') // false
```

### isPrimitive

Check if a value is a primitive type

```ts
import { isPrimitive } from '@setemiojo/utils'

isPrimitive('hello') // true
isPrimitive(42) // true
isPrimitive(true) // true
isPrimitive(null) // true
isPrimitive(undefined) // true
isPrimitive(Symbol('test')) // true
isPrimitive(123n) // true (BigInt)

isPrimitive({}) // false
isPrimitive([]) // false
isPrimitive(new Date()) // false
isPrimitive(() => {}) // false
```

## Specialized Type Checks

### isRegExp

Check if a value is a RegExp

```ts
import { isRegExp } from '@setemiojo/utils'

isRegExp(/test/) // true
isRegExp(new RegExp('test')) // true
isRegExp('test') // false
isRegExp(null) // false
```

### isDate

Check if a value is a Date

```ts
import { isDate } from '@setemiojo/utils'

isDate(new Date()) // true
isDate(new Date('2023-01-01')) // true
isDate('2023-01-01') // false
isDate(1703123456789) // false
isDate(null) // false
```

### isWindow

Check if a value is the window object (browser only)

```ts
import { isWindow } from '@setemiojo/utils'

isWindow(window) // true (in browser)
isWindow({}) // false
isWindow(null) // false
```

### isBrowser

Check if running in a browser environment

```ts
import { isBrowser } from '@setemiojo/utils'

isBrowser // true (in browser), false (in Node.js)
```

## Common Use Cases

### API Response Validation

```ts
import { isString, isNumber, isObject } from '@setemiojo/utils'

interface User {
  id: number
  name: string
  email: string
}

function validateUser(data: any): User | null {
  if (!isObject(data)) return null
  
  if (!isNumber(data.id) || !isString(data.name) || !isString(data.email)) {
    return null
  }
  
  return {
    id: data.id,
    name: data.name,
    email: data.email
  }
}
```

### Form Validation

```ts
import { isString, isNumber, isDef } from '@setemiojo/utils'

function validateFormData(data: Record<string, any>) {
  const errors: string[] = []
  
  if (!isString(data.name) || data.name.trim() === '') {
    errors.push('Name is required')
  }
  
  if (!isString(data.email) || !data.email.includes('@')) {
    errors.push('Valid email is required')
  }
  
  if (isDef(data.age) && (!isNumber(data.age) || data.age < 0)) {
    errors.push('Age must be a positive number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
```

### Type-Safe Property Access

```ts
import { isObject, isString, isNumber } from '@setemiojo/utils'

function getNestedProperty(obj: any, path: string) {
  if (!isObject(obj)) return undefined
  
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (!isObject(current) || !(key in current)) {
      return undefined
    }
    current = current[key]
  }
  
  return current
}

function getStringProperty(obj: any, key: string): string | undefined {
  const value = obj?.[key]
  return isString(value) ? value : undefined
}

function getNumberProperty(obj: any, key: string): number | undefined {
  const value = obj?.[key]
  return isNumber(value) ? value : undefined
}
```

### Environment Detection

```ts
import { isBrowser, isWindow } from '@setemiojo/utils'

function getGlobalObject() {
  if (isBrowser) {
    return window
  }
  return globalThis
}

function isInIframe() {
  if (!isBrowser) return false
  
  try {
    return isWindow(window) && window.self !== window.top
  } catch {
    return true
  }
}
```

### Data Processing Pipeline

```ts
import { isString, isNumber, isObject, isPrimitive } from '@setemiojo/utils'

function processData(data: any) {
  if (isPrimitive(data)) {
    return { type: 'primitive', value: data }
  }
  
  if (isObject(data)) {
    return { type: 'object', keys: Object.keys(data) }
  }
  
  if (isString(data)) {
    return { type: 'string', length: data.length }
  }
  
  if (isNumber(data)) {
    return { type: 'number', value: data }
  }
  
  return { type: 'unknown', value: data }
}
```
