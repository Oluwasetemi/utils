# String

Utilities for working with strings and text manipulation.

## String Manipulation

### slash

Replace backslashes with forward slashes

```ts
import { slash } from '@setemiojo/utils'

slash('C:\\Users\\John\\Documents') // 'C:/Users/John/Documents'
slash('path\\to\\file') // 'path/to/file'
```

### ensurePrefix

Ensure a string has a specific prefix

```ts
import { ensurePrefix } from '@setemiojo/utils'

ensurePrefix('https://', 'example.com') // 'https://example.com'
ensurePrefix('https://', 'https://example.com') // 'https://example.com' (unchanged)
ensurePrefix('api/', 'users') // 'api/users'
```

### ensureSuffix

Ensure a string has a specific suffix

```ts
import { ensureSuffix } from '@setemiojo/utils'

ensureSuffix('.js', 'index') // 'index.js'
ensureSuffix('.js', 'index.js') // 'index.js' (unchanged)
ensureSuffix('/', 'path') // 'path/'
```

### capitalize

Capitalize the first letter of a string

```ts
import { capitalize } from '@setemiojo/utils'

capitalize('hello') // 'Hello'
capitalize('HELLO') // 'Hello'
capitalize('hELLO') // 'Hello'
```

## String Templates

### template

Simple template engine with index-based or object-based variable substitution

```ts
import { template } from '@setemiojo/utils'

// Index-based substitution
template('Hello {0}! My name is {1}.', 'Inès', 'Anthony')
// 'Hello Inès! My name is Anthony.'

// Object-based substitution
template('{greet}! My name is {name}.', { greet: 'Hello', name: 'Anthony' })
// 'Hello! My name is Anthony.'

// With fallback values
template(
  '{greet}! My name is {name}.',
  { greet: 'Hello' }, // name is missing
  'placeholder'
)
// 'Hello! My name is placeholder.'

// With fallback function
template(
  '{greet}! My name is {name}.',
  { greet: 'Hello' },
  key => `[${key}]`
)
// 'Hello! My name is [name].'
```

## String Generation

### randomStr

Generate a random string

```ts
import { randomStr } from '@setemiojo/utils'

randomStr() // 'aB3xY9mK2pL8nQ7' (16 characters by default)
randomStr(8) // 'xY9mK2pL' (8 characters)
randomStr(10, '0123456789') // '3847291056' (custom alphabet)
```

## String Formatting

### unindent

Remove common leading whitespace from a template string

```ts
import { unindent } from '@setemiojo/utils'

const code = unindent`
  if (a) {
    b()
  }
`
// 'if (a) {\n  b()\n}'

const multiline = unindent`

  First line
  Second line

`
// 'First line\nSecond line'
```

## Common Use Cases

### Path Normalization

```ts
import { ensurePrefix, ensureSuffix, slash } from '@setemiojo/utils'

function normalizePath(path: string) {
  return ensureSuffix('/', slash(path))
}

normalizePath('C:\\Users\\John\\Documents') // 'C:/Users/John/Documents/'
```

### URL Building

```ts
import { ensurePrefix, ensureSuffix } from '@setemiojo/utils'

function buildUrl(base: string, path: string) {
  return ensureSuffix('/', ensurePrefix('https://', base))
    + ensurePrefix('/', path)
}

buildUrl('example.com', 'api/users') // 'https://example.com/api/users'
```

### Template Processing

```ts
import { template } from '@setemiojo/utils'

function createEmailTemplate(user: { name: string, email: string }) {
  return template(`
    Dear {name},

    Thank you for signing up with email {email}.

    Best regards,
    The Team
  `, user)
}
```
