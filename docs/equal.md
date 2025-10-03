# Equal

Utilities for deep equality comparison.

## Deep Equality

### isDeepEqual

Perform deep equality comparison between two values

```ts
import { isDeepEqual } from '@setemiojo/utils'

// Primitive values
isDeepEqual(42, 42) // true
isDeepEqual('hello', 'hello') // true
isDeepEqual(true, true) // true
isDeepEqual(null, null) // true
isDeepEqual(undefined, undefined) // true

// Different types
isDeepEqual(42, '42') // false
isDeepEqual(0, false) // false
isDeepEqual(null, undefined) // false

// Arrays
isDeepEqual([1, 2, 3], [1, 2, 3]) // true
isDeepEqual([1, 2, 3], [1, 2, 4]) // false
isDeepEqual([1, [2, 3]], [1, [2, 3]]) // true
isDeepEqual([1, [2, 3]], [1, [2, 4]]) // false

// Objects
isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }) // true
isDeepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }) // true (order doesn't matter)
isDeepEqual({ a: 1, b: 2 }, { a: 1, b: 3 }) // false
isDeepEqual({ a: { b: 1 } }, { a: { b: 1 } }) // true
isDeepEqual({ a: { b: 1 } }, { a: { b: 2 } }) // false

// Nested structures
isDeepEqual(
  { users: [{ id: 1, name: 'John' }] },
  { users: [{ id: 1, name: 'John' }] }
) // true
```

## Common Use Cases

### State Comparison

```ts
import { isDeepEqual } from '@setemiojo/utils'

interface AppState {
  user: { id: number; name: string }
  settings: { theme: string; language: string }
  data: any[]
}

function hasStateChanged(oldState: AppState, newState: AppState): boolean {
  return !isDeepEqual(oldState, newState)
}

// Usage in React-like component
class Component {
  private previousState: AppState | null = null
  
  updateState(newState: AppState) {
    if (!this.previousState || hasStateChanged(this.previousState, newState)) {
      this.render(newState)
      this.previousState = newState
    }
  }
}
```

### Cache Invalidation

```ts
import { isDeepEqual } from '@setemiojo/utils'

class CacheManager {
  private cache = new Map<string, { data: any; params: any }>()
  
  get<T>(key: string, params: any): T | null {
    const cached = this.cache.get(key)
    
    if (cached && isDeepEqual(cached.params, params)) {
      return cached.data
    }
    
    return null
  }
  
  set<T>(key: string, params: any, data: T) {
    this.cache.set(key, { data, params })
  }
}

// Usage
const cache = new CacheManager()

const params1 = { userId: 123, include: ['profile', 'settings'] }
const params2 = { userId: 123, include: ['profile', 'settings'] }

cache.set('user', params1, userData)

// This will return cached data because params are deeply equal
const cached = cache.get('user', params2)
```

### Configuration Comparison

```ts
import { isDeepEqual } from '@setemiojo/utils'

interface Config {
  api: {
    baseUrl: string
    timeout: number
    retries: number
  }
  ui: {
    theme: string
    language: string
  }
  features: string[]
}

function shouldReloadConfig(oldConfig: Config, newConfig: Config): boolean {
  return !isDeepEqual(oldConfig, newConfig)
}

function updateConfig(newConfig: Config) {
  const oldConfig = getCurrentConfig()
  
  if (shouldReloadConfig(oldConfig, newConfig)) {
    console.log('Configuration changed, reloading...')
    applyConfig(newConfig)
  } else {
    console.log('Configuration unchanged')
  }
}
```

### Form Validation

```ts
import { isDeepEqual } from '@setemiojo/utils'

interface FormData {
  personal: {
    firstName: string
    lastName: string
    email: string
  }
  preferences: {
    newsletter: boolean
    notifications: string[]
  }
}

function hasFormChanged(originalData: FormData, currentData: FormData): boolean {
  return !isDeepEqual(originalData, currentData)
}

function saveForm(formData: FormData) {
  const originalData = getOriginalFormData()
  
  if (hasFormChanged(originalData, formData)) {
    // Only save if form has actually changed
    persistFormData(formData)
    showSuccessMessage('Form saved successfully')
  } else {
    showInfoMessage('No changes to save')
  }
}
```

### Object Diff Detection

```ts
import { isDeepEqual } from '@setemiojo/utils'

function findChangedProperties<T extends Record<string, any>>(
  oldObj: T,
  newObj: T
): Partial<T> {
  const changes: Partial<T> = {}
  
  for (const key in newObj) {
    if (!isDeepEqual(oldObj[key], newObj[key])) {
      changes[key] = newObj[key]
    }
  }
  
  return changes
}

// Usage
const oldUser = {
  name: 'John Doe',
  email: 'john@example.com',
  settings: { theme: 'light', notifications: true }
}

const newUser = {
  name: 'John Doe',
  email: 'john.doe@example.com', // Changed
  settings: { theme: 'dark', notifications: true } // Changed
}

const changes = findChangedProperties(oldUser, newUser)
// { email: 'john.doe@example.com', settings: { theme: 'dark', notifications: true } }
```

### Test Assertions

```ts
import { isDeepEqual } from '@setemiojo/utils'

function assertDeepEqual<T>(actual: T, expected: T, message?: string) {
  if (!isDeepEqual(actual, expected)) {
    throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}

// Usage in tests
describe('User Service', () => {
  it('should create user with correct data', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      preferences: { theme: 'dark' }
    }
    
    const result = createUser(userData)
    
    assertDeepEqual(result, {
      id: expect.any(Number),
      ...userData,
      createdAt: expect.any(Date)
    })
  })
})
```

### Data Synchronization

```ts
import { isDeepEqual } from '@setemiojo/utils'

class DataSync {
  private localData: any = null
  
  async sync(remoteData: any) {
    if (!this.localData || !isDeepEqual(this.localData, remoteData)) {
      console.log('Data changed, updating local copy')
      this.localData = remoteData
      await this.persistLocal(remoteData)
    } else {
      console.log('Data unchanged, skipping sync')
    }
  }
  
  private async persistLocal(data: any) {
    // Save to local storage or database
  }
}
```
