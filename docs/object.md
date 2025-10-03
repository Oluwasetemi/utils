# Object

Utilities for working with objects and object manipulation.

## Object Transformation

### objectMap

Map key/value pairs for an object and construct a new one

```ts
import { objectMap } from '@setemiojo/utils'

const obj = { a: 1, b: 2, c: 3 }

// Transform keys and values
objectMap(obj, (k, v) => [k.toUpperCase(), v.toString()])
// { A: '1', B: '2', C: '3' }

// Swap key/value
objectMap(obj, (k, v) => [v, k])
// { 1: 'a', 2: 'b', 3: 'c' }

// Filter keys by returning undefined
objectMap(obj, (k, v) => k === 'a' ? undefined : [k, v])
// { b: 2, c: 3 }
```

## Object Access

### objectKeys

Strict typed `Object.keys`

```ts
import { objectKeys } from '@setemiojo/utils'

const obj = { name: 'John', age: 30, active: true }

objectKeys(obj) // ['name', 'age', 'active'] with proper typing
```

### objectEntries

Strict typed `Object.entries`

```ts
import { objectEntries } from '@setemiojo/utils'

const obj = { name: 'John', age: 30 }

objectEntries(obj) // [['name', 'John'], ['age', 30]] with proper typing
```

### isKeyOf

Type guard to check if a key exists in an object

```ts
import { isKeyOf } from '@setemiojo/utils'

const obj = { name: 'John', age: 30 }

if (isKeyOf(obj, 'name')) {
  // TypeScript knows 'name' is a key of obj
  console.log(obj.name) // 'John'
}
```

## Object Merging

### deepMerge

Deep merge objects (mutates the target object)

```ts
import { deepMerge } from '@setemiojo/utils'

const target = {
  user: { name: 'John', age: 30 },
  settings: { theme: 'dark' }
}

const source = {
  user: { age: 31, city: 'NYC' },
  settings: { language: 'en' }
}

deepMerge(target, source)
// {
//   user: { name: 'John', age: 31, city: 'NYC' },
//   settings: { theme: 'dark', language: 'en' }
// }
```

### deepMergeWithArray

Deep merge objects with array concatenation instead of override

```ts
import { deepMergeWithArray } from '@setemiojo/utils'

const target = {
  tags: ['javascript', 'typescript'],
  config: { port: 3000 }
}

const source = {
  tags: ['react', 'vue'],
  config: { host: 'localhost' }
}

deepMergeWithArray(target, source)
// {
//   tags: ['javascript', 'typescript', 'react', 'vue'],
//   config: { port: 3000, host: 'localhost' }
// }
```

## Object Selection

### objectPick

Create a new subset object by giving keys

```ts
import { objectPick } from '@setemiojo/utils'

const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  age: 30,
  password: 'secret'
}

objectPick(user, ['name', 'email'])
// { name: 'John', email: 'john@example.com' }

// With omitUndefined option
const partialUser = { name: 'John', email: undefined, age: 30 }
objectPick(partialUser, ['name', 'email', 'age'], true)
// { name: 'John', age: 30 } (undefined values omitted)
```

## Object Utilities

### clearUndefined

Clear undefined fields from an object (mutates the object)

```ts
import { clearUndefined } from '@setemiojo/utils'

const obj = {
  name: 'John',
  age: undefined,
  email: 'john@example.com',
  city: undefined
}

clearUndefined(obj)
// { name: 'John', email: 'john@example.com' }
```

### hasOwnProperty

Safe way to check if an object has a property

```ts
import { hasOwnProperty } from '@setemiojo/utils'

const obj = { name: 'John' }

hasOwnProperty(obj, 'name') // true
hasOwnProperty(obj, 'toString') // false
hasOwnProperty(null, 'name') // false
hasOwnProperty(undefined, 'name') // false
```

### objectId

Get an object's unique identifier

```ts
import { objectId } from '@setemiojo/utils'

const obj1 = { name: 'John' }
const obj2 = { name: 'John' }

objectId(obj1) // 'aB3xY9mK2pL8nQ7' (random string)
objectId(obj2) // 'xY9mK2pL8nQ7aB3' (different random string)
objectId(obj1) // 'aB3xY9mK2pL8nQ7' (same as first call)

// For primitives, returns the value as string
objectId(42) // '42'
objectId('hello') // 'hello'
```

## Common Use Cases

### Configuration Merging

```ts
import { deepMerge } from '@setemiojo/utils'

const defaultConfig = {
  api: { baseUrl: 'https://api.example.com', timeout: 5000 },
  ui: { theme: 'light', language: 'en' }
}

const userConfig = {
  api: { timeout: 10000 },
  ui: { theme: 'dark' }
}

const finalConfig = deepMerge(defaultConfig, userConfig)
// {
//   api: { baseUrl: 'https://api.example.com', timeout: 10000 },
//   ui: { theme: 'dark', language: 'en' }
// }
```

### Safe Property Access

```ts
import { isKeyOf, hasOwnProperty } from '@setemiojo/utils'

function getProperty<T>(obj: T, key: string) {
  if (isKeyOf(obj, key) && hasOwnProperty(obj, key)) {
    return obj[key]
  }
  return undefined
}

const user = { name: 'John', age: 30 }
getProperty(user, 'name') // 'John'
getProperty(user, 'email') // undefined
```

### Object Transformation Pipeline

```ts
import { objectMap, objectPick, clearUndefined } from '@setemiojo/utils'

function transformUserData(rawData: any) {
  return clearUndefined(
    objectPick(
      objectMap(rawData, (k, v) => [
        k.toLowerCase(),
        typeof v === 'string' ? v.trim() : v
      ]),
      ['name', 'email', 'age']
    )
  )
}
```
