# Base

Core utility functions and helpers.

## Assertions

### assert

Assert a condition and throw an error if false

```ts
import { assert } from '@setemiojo/utils'

function divide(a: number, b: number): number {
  assert(b !== 0, 'Division by zero is not allowed')
  return a / b
}

function processUser(user: any) {
  assert(user && typeof user === 'object', 'User must be an object')
  assert(typeof user.name === 'string', 'User name must be a string')
  assert(typeof user.age === 'number', 'User age must be a number')
  
  return {
    name: user.name,
    age: user.age
  }
}

// Usage
try {
  const result = divide(10, 0) // Throws: "Division by zero is not allowed"
} catch (error) {
  console.error(error.message)
}
```

## Type Utilities

### toString

Get the string representation of a value's type

```ts
import { toString } from '@setemiojo/utils'

toString({}) // '[object Object]'
toString([]) // '[object Array]'
toString(new Date()) // '[object Date]'
toString(/regex/) // '[object RegExp]'
toString(null) // '[object Null]'
toString(undefined) // '[object Undefined]'
toString('string') // '[object String]'
toString(42) // '[object Number]'
toString(true) // '[object Boolean]'
toString(() => {}) // '[object Function]'
```

### getTypeName

Get a human-readable type name

```ts
import { getTypeName } from '@setemiojo/utils'

getTypeName({}) // 'object'
getTypeName([]) // 'array'
getTypeName(new Date()) // 'date'
getTypeName(/regex/) // 'regexp'
getTypeName(null) // 'null'
getTypeName(undefined) // 'undefined'
getTypeName('string') // 'string'
getTypeName(42) // 'number'
getTypeName(true) // 'boolean'
getTypeName(() => {}) // 'function'
getTypeName(Symbol('test')) // 'symbol'
getTypeName(123n) // 'bigint'
```

### noop

A no-operation function

```ts
import { noop } from '@setemiojo/utils'

// Useful as default callback
function processData(data: any[], callback = noop) {
  // Process data...
  callback(data)
}

// Useful for optional event handlers
const button = {
  onClick: noop, // Default to no-op
  onHover: noop
}

// Useful for testing
const mockFunction = noop
```

## Common Use Cases

### Input Validation

```ts
import { assert, getTypeName } from '@setemiojo/utils'

function validateInput(input: any, expectedType: string) {
  const actualType = getTypeName(input)
  assert(actualType === expectedType, `Expected ${expectedType}, got ${actualType}`)
}

function processApiResponse(response: any) {
  validateInput(response, 'object')
  validateInput(response.data, 'array')
  validateInput(response.status, 'number')
  
  return response.data
}
```

### Type-Safe Property Access

```ts
import { assert, getTypeName } from '@setemiojo/utils'

function getProperty<T>(obj: any, key: string, expectedType: string): T {
  assert(getTypeName(obj) === 'object', 'First argument must be an object')
  assert(key in obj, `Property '${key}' does not exist`)
  
  const value = obj[key]
  const actualType = getTypeName(value)
  assert(actualType === expectedType, `Property '${key}' must be ${expectedType}, got ${actualType}`)
  
  return value
}

// Usage
const user = { name: 'John', age: 30, active: true }

const name = getProperty<string>(user, 'name', 'string') // 'John'
const age = getProperty<number>(user, 'age', 'number') // 30
const active = getProperty<boolean>(user, 'active', 'boolean') // true
```

### Debugging and Logging

```ts
import { getTypeName, toString } from '@setemiojo/utils'

function debugValue(value: any, label = 'Value') {
  console.log(`${label}:`, {
    value,
    type: getTypeName(value),
    stringRepresentation: toString(value),
    isPrimitive: ['string', 'number', 'boolean', 'null', 'undefined', 'symbol', 'bigint'].includes(getTypeName(value))
  })
}

// Usage
debugValue({ name: 'John' }, 'User Object')
debugValue([1, 2, 3], 'Numbers Array')
debugValue(new Date(), 'Current Date')
```

### Configuration Validation

```ts
import { assert, getTypeName } from '@setemiojo/utils'

interface Config {
  apiUrl: string
  timeout: number
  retries: number
  debug: boolean
}

function validateConfig(config: any): Config {
  assert(getTypeName(config) === 'object', 'Config must be an object')
  
  assert('apiUrl' in config, 'Config must have apiUrl property')
  assert(getTypeName(config.apiUrl) === 'string', 'apiUrl must be a string')
  assert(config.apiUrl.startsWith('http'), 'apiUrl must be a valid URL')
  
  assert('timeout' in config, 'Config must have timeout property')
  assert(getTypeName(config.timeout) === 'number', 'timeout must be a number')
  assert(config.timeout > 0, 'timeout must be positive')
  
  assert('retries' in config, 'Config must have retries property')
  assert(getTypeName(config.retries) === 'number', 'retries must be a number')
  assert(Number.isInteger(config.retries), 'retries must be an integer')
  assert(config.retries >= 0, 'retries must be non-negative')
  
  assert('debug' in config, 'Config must have debug property')
  assert(getTypeName(config.debug) === 'boolean', 'debug must be a boolean')
  
  return config as Config
}
```

### Error Handling

```ts
import { assert } from '@setemiojo/utils'

class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

function validateEmail(email: string): string {
  assert(typeof email === 'string', 'Email must be a string')
  assert(email.includes('@'), 'Email must contain @ symbol')
  assert(email.length > 5, 'Email must be at least 5 characters long')
  
  return email.toLowerCase()
}

function processUserData(data: any) {
  try {
    assert(data && typeof data === 'object', 'User data must be an object')
    assert(data.email, 'Email is required')
    assert(data.name, 'Name is required')
    
    return {
      email: validateEmail(data.email),
      name: data.name.trim()
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError(error.message)
    }
    throw error
  }
}
```

### Mock Functions

```ts
import { noop } from '@setemiojo/utils'

// Default event handlers
const defaultEventHandlers = {
  onClick: noop,
  onHover: noop,
  onFocus: noop,
  onBlur: noop
}

// Optional callback parameters
function processItems(items: any[], onProgress = noop, onComplete = noop) {
  items.forEach((item, index) => {
    // Process item...
    onProgress(index, items.length)
  })
  onComplete()
}

// Testing utilities
const mockApi = {
  get: noop,
  post: noop,
  put: noop,
  delete: noop
}
```
