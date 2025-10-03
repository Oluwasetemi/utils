# Function

Utilities for working with functions and function execution.

## Function Execution

### batchInvoke

Call every function in an array

```ts
import { batchInvoke } from '@setemiojo/utils'

const functions = [
  () => console.log('First'),
  () => console.log('Second'),
  null, // ignored
  undefined, // ignored
  () => console.log('Third')
]

batchInvoke(functions)
// Output:
// First
// Second
// Third
```

### invoke

Call a function and return its result

```ts
import { invoke } from '@setemiojo/utils'

const result = invoke(() => {
  console.log('Function called')
  return 42
})
// Output: Function called
// result: 42

// Useful for lazy evaluation
const value = invoke(() => expensiveComputation())
```

### tap

Pass a value through a callback and return the original value

```ts
import { tap } from '@setemiojo/utils'

// Builder pattern
function createUser(name: string) {
  return tap(new User(), (user) => {
    user.name = name
    user.createdAt = new Date()
    user.isActive = true
  })
}

// Side effects with return value preservation
const result = tap(computeValue(), (value) => {
  console.log('Computed value:', value)
  trackMetric('computation', value)
})
// result contains the computed value, side effects are executed

// Method chaining
const processed = tap(rawData, (data) => {
  validateData(data)
  logData(data)
})
  .then(transformData)
  .then(saveData)
```

## Common Use Cases

### Builder Pattern

```ts
import { tap } from '@setemiojo/utils'

class QueryBuilder {
  private query: any = {}

  select(fields: string[]) {
    return tap(this, () => {
      this.query.select = fields
    })
  }

  where(condition: any) {
    return tap(this, () => {
      this.query.where = condition
    })
  }

  limit(count: number) {
    return tap(this, () => {
      this.query.limit = count
    })
  }

  build() {
    return this.query
  }
}

const query = new QueryBuilder()
  .select(['name', 'email'])
  .where({ active: true })
  .limit(10)
  .build()
```

### Cleanup and Resource Management

```ts
import { batchInvoke } from '@setemiojo/utils'

class ResourceManager {
  private cleanupFunctions: (() => void)[] = []

  addCleanup(fn: () => void) {
    this.cleanupFunctions.push(fn)
  }

  cleanup() {
    batchInvoke(this.cleanupFunctions)
    this.cleanupFunctions = []
  }
}

const manager = new ResourceManager()
manager.addCleanup(() => closeDatabase())
manager.addCleanup(() => clearCache())
manager.addCleanup(() => removeEventListeners())

// Later...
manager.cleanup() // All cleanup functions are called
```

### Lazy Evaluation

```ts
import { invoke } from '@setemiojo/utils'

function expensiveOperation() {
  console.log('Performing expensive operation...')
  return Math.random() * 1000
}

// Only compute if needed
function processData(shouldCompute: boolean) {
  const data = shouldCompute
    ? invoke(expensiveOperation)
    : null

  return data
}

// Expensive operation only runs when shouldCompute is true
const result1 = processData(false) // null, no computation
const result2 = processData(true) // computation runs
```

### Debugging and Logging

```ts
import { tap } from '@setemiojo/utils'

function processUserData(user: User) {
  return tap(user, (u) => {
    console.log('Processing user:', u.id)
    console.log('User data:', JSON.stringify(u, null, 2))
  })
    .then(validateUser)
    .then(transformUser)
    .then(tap((u) => {
      console.log('Final user data:', u)
      analytics.track('user_processed', { userId: u.id })
    }))
}
```

### Conditional Execution

```ts
import { batchInvoke } from '@setemiojo/utils'

function setupEnvironment(env: string) {
  const setupFunctions = [
    () => loadConfig(env),
    () => initializeDatabase(),
    env === 'development' ? () => enableDebugMode() : null,
    env === 'production' ? () => enableLogging() : null,
    () => startServer()
  ].filter(Boolean)

  batchInvoke(setupFunctions)
}
```
