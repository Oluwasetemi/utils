# Promise

Utilities for working with promises and asynchronous operations.

## Promise Management

### createSingletonPromise

Create a singleton promise function that ensures only one instance runs at a time

```ts
import { createSingletonPromise } from '@setemiojo/utils'

const fetchUserData = createSingletonPromise(async () => {
  console.log('Fetching user data...')
  const response = await fetch('/api/user')
  return response.json()
})

// Multiple calls will reuse the same promise
const promise1 = fetchUserData()
const promise2 = fetchUserData()
const promise3 = fetchUserData()

// All three variables reference the same promise
console.log(promise1 === promise2) // true
console.log(promise2 === promise3) // true

// Reset the singleton to allow a new promise
await fetchUserData.reset()
```

### sleep

Promised `setTimeout` with optional callback

```ts
import { sleep } from '@setemiojo/utils'

// Basic delay
await sleep(1000) // Wait 1 second

// With callback
await sleep(1000, () => {
  console.log('1 second has passed')
})

// With async callback
await sleep(1000, async () => {
  await cleanup()
  console.log('Cleanup completed')
})
```

### createPromiseLock

Create a promise lock for managing concurrent operations

```ts
import { createPromiseLock } from '@setemiojo/utils'

const lock = createPromiseLock()

// Run operations through the lock
lock.run(async () => {
  console.log('Task 1 started')
  await sleep(1000)
  console.log('Task 1 completed')
})

lock.run(async () => {
  console.log('Task 2 started')
  await sleep(500)
  console.log('Task 2 completed')
})

// Wait for all tasks to complete
await lock.wait()
console.log('All tasks completed')

// Check if any tasks are running
console.log(lock.isWaiting()) // true/false

// Clear all pending tasks
lock.clear()
```

### createControlledPromise

Create a promise with external resolve/reject control

```ts
import { createControlledPromise } from '@setemiojo/utils'

const promise = createControlledPromise<string>()

// Set up promise handling
promise.then(result => {
  console.log('Promise resolved with:', result)
}).catch(error => {
  console.log('Promise rejected with:', error)
})

// Resolve from another context
setTimeout(() => {
  promise.resolve('Hello World!')
}, 1000)

// Or reject
// promise.reject(new Error('Something went wrong'))
```

## Common Use Cases

### API Request Deduplication

```ts
import { createSingletonPromise } from '@setemiojo/utils'

const apiCache = new Map<string, ReturnType<typeof createSingletonPromise>>()

function createApiRequest(url: string) {
  if (!apiCache.has(url)) {
    apiCache.set(url, createSingletonPromise(async () => {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json()
    }))
  }
  return apiCache.get(url)!
}

// Multiple components can request the same data
const userPromise1 = createApiRequest('/api/user/123')
const userPromise2 = createApiRequest('/api/user/123')
// Only one actual HTTP request is made
```

### Rate Limiting

```ts
import { createPromiseLock, sleep } from '@setemiojo/utils'

class RateLimiter {
  private lock = createPromiseLock()
  private lastRequest = 0
  private minInterval: number

  constructor(minInterval: number) {
    this.minInterval = minInterval
  }

  async request<T>(fn: () => Promise<T>): Promise<T> {
    return this.lock.run(async () => {
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequest
      
      if (timeSinceLastRequest < this.minInterval) {
        await sleep(this.minInterval - timeSinceLastRequest)
      }
      
      this.lastRequest = Date.now()
      return fn()
    })
  }
}

const limiter = new RateLimiter(1000) // 1 request per second

// All requests will be rate limited
limiter.request(() => fetch('/api/data1'))
limiter.request(() => fetch('/api/data2'))
limiter.request(() => fetch('/api/data3'))
```

### Async Queue Processing

```ts
import { createPromiseLock } from '@setemiojo/utils'

class AsyncQueue {
  private lock = createPromiseLock()
  private queue: (() => Promise<any>)[] = []

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.process()
    })
  }

  private async process() {
    if (this.queue.length === 0) return

    const task = this.queue.shift()!
    await this.lock.run(task)
    
    // Process next task
    if (this.queue.length > 0) {
      this.process()
    }
  }
}

const queue = new AsyncQueue()

// Tasks will be processed one at a time
queue.add(() => fetch('/api/task1'))
queue.add(() => fetch('/api/task2'))
queue.add(() => fetch('/api/task3'))
```

### Timeout Wrapper

```ts
import { createControlledPromise, sleep } from '@setemiojo/utils'

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = createControlledPromise<T>()
  
  // Set up timeout
  const timeoutId = setTimeout(() => {
    timeoutPromise.reject(new Error(`Operation timed out after ${timeoutMs}ms`))
  }, timeoutMs)
  
  // Handle promise completion
  promise
    .then(result => {
      clearTimeout(timeoutId)
      timeoutPromise.resolve(result)
    })
    .catch(error => {
      clearTimeout(timeoutId)
      timeoutPromise.reject(error)
    })
  
  return timeoutPromise
}

// Usage
const slowOperation = sleep(5000).then(() => 'completed')
const result = await withTimeout(slowOperation, 2000)
// Will throw timeout error after 2 seconds
```

### Retry Logic

```ts
import { sleep } from '@setemiojo/utils'

async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxAttempts) {
        throw lastError
      }
      
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`)
      await sleep(delay)
    }
  }
  
  throw lastError!
}

// Usage
const result = await retry(
  () => fetch('/api/unreliable-endpoint'),
  3,
  1000
)
```
