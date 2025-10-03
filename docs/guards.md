# Guards

Type guards for filtering and type narrowing.

## Null and Undefined Guards

### notNullish

Type guard to filter out null and undefined values

```ts
import { notNullish } from '@setemiojo/utils'

const values = [1, null, 2, undefined, 3, null, 4]

const filtered = values.filter(notNullish)
// filtered: [1, 2, 3, 4] with type number[]

// Type narrowing
function processValue(value: string | null | undefined) {
  if (notNullish(value)) {
    // value is now typed as string
    return value.toUpperCase()
  }
  return 'default'
}
```

### noNull

Type guard to filter out null values (keeps undefined)

```ts
import { noNull } from '@setemiojo/utils'

const values = [1, null, 2, undefined, 3]

const filtered = values.filter(noNull)
// filtered: [1, 2, undefined, 3] with type (number | undefined)[]

// Type narrowing
function processValue(value: string | null) {
  if (noNull(value)) {
    // value is now typed as string
    return value.length
  }
  return 0
}
```

### notUndefined

Type guard to filter out undefined values (keeps null)

```ts
import { notUndefined } from '@setemiojo/utils'

const values = [1, null, 2, undefined, 3]

const filtered = values.filter(notUndefined)
// filtered: [1, null, 2, 3] with type (number | null)[]

// Type narrowing
function processValue(value: string | undefined) {
  if (notUndefined(value)) {
    // value is now typed as string
    return value.trim()
  }
  return ''
}
```

### isTruthy

Type guard to filter out falsy values

```ts
import { isTruthy } from '@setemiojo/utils'

const values = [1, 0, 'hello', '', true, false, null, undefined]

const filtered = values.filter(isTruthy)
// filtered: [1, 'hello', true] with type (number | string | true)[]

// Type narrowing
function processValue(value: string | null | undefined | 0) {
  if (isTruthy(value)) {
    // value is now typed as string (excludes null, undefined, 0)
    return value.length
  }
  return 0
}
```

## Common Use Cases

### Array Filtering

```ts
import { isTruthy, notNullish } from '@setemiojo/utils'

// Filter out null/undefined from API responses
interface ApiResponse {
  data: (User | null)[]
}

function processUsers(response: ApiResponse) {
  const validUsers = response.data.filter(notNullish)
  // validUsers is typed as User[]

  return validUsers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }))
}

// Filter out falsy values from form data
function processFormData(data: Record<string, any>) {
  const cleanData = Object.fromEntries(
    Object.entries(data)
      .filter(([_, value]) => isTruthy(value))
  )

  return cleanData
}
```

### Optional Chaining Alternative

```ts
import { notNullish } from '@setemiojo/utils'

// Instead of optional chaining everywhere
function getNestedValue(obj: any) {
  return obj?.user?.profile?.name
}

// Use type guards for more control
function getNestedValueSafe(obj: any) {
  if (notNullish(obj)
    && notNullish(obj.user)
    && notNullish(obj.user.profile)) {
    return obj.user.profile.name
  }
  return null
}
```

### Data Validation

```ts
import { isTruthy, notNullish } from '@setemiojo/utils'

interface FormField {
  value: string | null | undefined
  required: boolean
}

function validateForm(fields: FormField[]) {
  const errors: string[] = []

  fields.forEach((field, index) => {
    if (field.required && !isTruthy(field.value)) {
      errors.push(`Field ${index} is required`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Filter valid form data
function getValidFormData(fields: FormField[]) {
  return fields
    .filter(field => isTruthy(field.value))
    .map(field => field.value) // TypeScript knows these are truthy
}
```

### API Response Processing

```ts
import { notNullish } from '@setemiojo/utils'

interface ApiUser {
  id: number
  name: string | null
  email: string
  avatar?: string | null
}

function processApiUsers(users: ApiUser[]) {
  return users
    .filter(user => notNullish(user.name)) // Filter users with names
    .map(user => ({
      id: user.id,
      name: user.name, // TypeScript knows this is not null
      email: user.email,
      avatar: user.avatar || 'default-avatar.png'
    }))
}
```

### Configuration Processing

```ts
import { isTruthy, notNullish } from '@setemiojo/utils'

interface Config {
  apiUrl?: string
  timeout?: number
  retries?: number
  debug?: boolean
}

function processConfig(rawConfig: Record<string, any>): Config {
  // Filter out null/undefined values
  const cleanConfig = Object.fromEntries(
    Object.entries(rawConfig).filter(([_, value]) => notNullish(value))
  )

  // Filter out falsy values for boolean flags
  const config: Config = {}

  if (isTruthy(cleanConfig.apiUrl)) {
    config.apiUrl = cleanConfig.apiUrl
  }

  if (isTruthy(cleanConfig.timeout)) {
    config.timeout = cleanConfig.timeout
  }

  if (isTruthy(cleanConfig.retries)) {
    config.retries = cleanConfig.retries
  }

  if (isTruthy(cleanConfig.debug)) {
    config.debug = cleanConfig.debug
  }

  return config
}
```

### Error Handling

```ts
import { notNullish } from '@setemiojo/utils'

interface Result<T> {
  data?: T
  error?: string
}

function processResults<T>(results: Result<T>[]) {
  const successful = results
    .filter(result => notNullish(result.data))
    .map(result => result.data) // TypeScript knows data is not null

  const errors = results
    .filter(result => notNullish(result.error))
    .map(result => result.error) // TypeScript knows error is not null

  return { successful, errors }
}
```
