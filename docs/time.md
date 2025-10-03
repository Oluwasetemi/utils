# Time

Utilities for working with time and timestamps.

## Timestamp Generation

### timestamp

Get the current timestamp as a number

```ts
import { timestamp } from '@setemiojo/utils'

const now = timestamp() // 1703123456789 (current timestamp in milliseconds)

// Equivalent to Date.now() but more concise
const now2 = Date.now() // Same result
```

## Common Use Cases

### Performance Measurement

```ts
import { timestamp } from '@setemiojo/utils'

function measurePerformance<T>(fn: () => T): { result: T, duration: number } {
  const start = timestamp()
  const result = fn()
  const end = timestamp()

  return {
    result,
    duration: end - start
  }
}

// Usage
const { result, duration } = measurePerformance(() => {
  // Some expensive operation
  return heavyComputation()
})

console.log(`Operation took ${duration}ms`)
```

### Cache with Expiration

```ts
import { timestamp } from '@setemiojo/utils'

class TimedCache<T> {
  private cache = new Map<string, { value: T, expires: number }>()
  private ttl: number

  constructor(ttlMs: number) {
    this.ttl = ttlMs
  }

  set(key: string, value: T) {
    this.cache.set(key, {
      value,
      expires: timestamp() + this.ttl
    })
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key)

    if (!item)
      return undefined

    if (timestamp() > item.expires) {
      this.cache.delete(key)
      return undefined
    }

    return item.value
  }

  clear() {
    this.cache.clear()
  }
}

// Usage
const cache = new TimedCache<string>(5000) // 5 second TTL

cache.set('user:123', 'John Doe')
console.log(cache.get('user:123')) // 'John Doe'

// After 5 seconds
setTimeout(() => {
  console.log(cache.get('user:123')) // undefined
}, 6000)
```

### Request Deduplication

```ts
import { timestamp } from '@setemiojo/utils'

class RequestDeduplicator {
  private requests = new Map<string, { promise: Promise<any>, timestamp: number }>()
  private dedupeWindow = 1000 // 1 second

  async request<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const now = timestamp()
    const existing = this.requests.get(key)

    // Return existing request if it's within the dedupe window
    if (existing && (now - existing.timestamp) < this.dedupeWindow) {
      return existing.promise
    }

    // Create new request
    const promise = fn()
    this.requests.set(key, { promise, timestamp: now })

    // Clean up after completion
    promise.finally(() => {
      this.requests.delete(key)
    })

    return promise
  }
}

const deduplicator = new RequestDeduplicator()

// Multiple calls with the same key within 1 second will return the same promise
const promise1 = deduplicator.request('user:123', () => fetchUser(123))
const promise2 = deduplicator.request('user:123', () => fetchUser(123))
console.log(promise1 === promise2) // true
```

### Rate Limiting

```ts
import { timestamp } from '@setemiojo/utils'

class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  canMakeRequest(): boolean {
    const now = timestamp()

    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs)

    if (this.requests.length >= this.maxRequests) {
      return false
    }

    this.requests.push(now)
    return true
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length < this.maxRequests) {
      return 0
    }

    const oldestRequest = Math.min(...this.requests)
    const timeUntilOldestExpires = this.windowMs - (timestamp() - oldestRequest)

    return Math.max(0, timeUntilOldestExpires)
  }
}

// Usage
const limiter = new RateLimiter(10, 60000) // 10 requests per minute

if (limiter.canMakeRequest()) {
  // Make the request
  makeApiCall()
}
else {
  const waitTime = limiter.getTimeUntilNextRequest()
  console.log(`Rate limited. Wait ${waitTime}ms before next request`)
}
```

### Session Management

```ts
import { timestamp } from '@setemiojo/utils'

interface Session {
  id: string
  userId: string
  createdAt: number
  lastActivity: number
  expiresAt: number
}

class SessionManager {
  private sessions = new Map<string, Session>()
  private sessionTimeout = 30 * 60 * 1000 // 30 minutes

  createSession(userId: string): string {
    const sessionId = generateSessionId()
    const now = timestamp()

    const session: Session = {
      id: sessionId,
      userId,
      createdAt: now,
      lastActivity: now,
      expiresAt: now + this.sessionTimeout
    }

    this.sessions.set(sessionId, session)
    return sessionId
  }

  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)

    if (!session)
      return false

    const now = timestamp()

    if (now > session.expiresAt) {
      this.sessions.delete(sessionId)
      return false
    }

    // Update last activity
    session.lastActivity = now
    session.expiresAt = now + this.sessionTimeout

    return true
  }

  cleanupExpiredSessions() {
    const now = timestamp()

    for (const [sessionId, session] of this.sessions) {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId)
      }
    }
  }
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + timestamp().toString(36)
}
```
