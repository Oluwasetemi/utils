# Documentation

Comprehensive documentation for all utilities in the `@setemiojo/utils` library.

## Available Utilities

### [Array](./array.md)
Utilities for working with arrays and array-like objects.
- Array conversion (`toArray`, `flattenArrayable`, `mergeArrayable`)
- Array manipulation (`partition`, `uniq`, `uniqueBy`, `remove`, `move`, `shuffle`)
- Array access (`at`, `last`, `sample`)
- Array generation (`range`)
- Array utilities (`clampArrayRange`, `filterInPlace`)

### [Base](./base.md)
Core utility functions and helpers.
- Assertions (`assert`)
- Type utilities (`toString`, `getTypeName`)
- Common helpers (`noop`)

### [Equal](./equal.md)
Utilities for deep equality comparison.
- Deep equality (`isDeepEqual`)

### [Function](./function.md)
Utilities for working with functions and function execution.
- Function execution (`batchInvoke`, `invoke`, `tap`)

### [Guards](./guards.md)
Type guards for filtering and type narrowing.
- Null and undefined guards (`notNullish`, `noNull`, `notUndefined`)
- Truthy guards (`isTruthy`)

### [Is](./is.md)
Type checking utilities for runtime type validation.
- Basic type checks (`isDef`, `isUndefined`, `isNull`, `isBoolean`, `isNumber`, `isString`, `isFunction`, `isObject`)
- Primitive checks (`isPrimitive`)
- Specialized checks (`isRegExp`, `isDate`, `isWindow`, `isBrowser`)

### [Math](./math.md)
Utilities for mathematical operations and calculations.
- Basic math (`clamp`, `sum`)
- Interpolation (`lerp`, `remap`)

### [Object](./object.md)
Utilities for working with objects and object manipulation.
- Object transformation (`objectMap`)
- Object access (`objectKeys`, `objectEntries`, `isKeyOf`)
- Object merging (`deepMerge`, `deepMergeWithArray`)
- Object selection (`objectPick`)
- Object utilities (`clearUndefined`, `hasOwnProperty`, `objectId`)

### [Promise](./promise.md)
Utilities for working with promises and asynchronous operations.
- Promise management (`createSingletonPromise`, `sleep`, `createPromiseLock`, `createControlledPromise`)

### [String](./string.md)
Utilities for working with strings and text manipulation.
- String manipulation (`slash`, `ensurePrefix`, `ensureSuffix`, `capitalize`)
- String templates (`template`)
- String generation (`randomStr`)
- String formatting (`unindent`)

### [Time](./time.md)
Utilities for working with time and timestamps.
- Timestamp generation (`timestamp`)

### [p](./p.md)
Utility for managing multiple promises with a fluent API.
- Promise collection and chaining
- Concurrency control
- Additional methods (`forEach`, `reduce`, `clear`)

## Quick Start

```ts
import { 
  // Array utilities
  toArray, partition, uniq,
  
  // String utilities
  capitalize, template, randomStr,
  
  // Object utilities
  objectMap, deepMerge, objectPick,
  
  // Promise utilities
  sleep, createSingletonPromise,
  
  // Type guards
  notNullish, isString, isObject,
  
  // And many more...
} from '@setemiojo/utils'
```

## Installation

```bash
npm install @setemiojo/utils
# or
yarn add @setemiojo/utils
# or
pnpm add @setemiojo/utils
# or
bun add @setemiojo/utils
```

## TypeScript Support

All utilities are fully typed and provide excellent TypeScript support with proper type inference and narrowing.

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing to this project.
