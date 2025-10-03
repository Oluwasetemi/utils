# p

Utility for managing multiple promises with a fluent API.

## Without

```ts
const items = [1, 2, 3, 4, 5]

;(await Promise.all(items
  .map(async (i) => {
    const v = await multiply(i, 3)
    const even = await isEven(v)
    return [even, v]
  })))
  .filter(x => x[0])
  .map(x => x[1])
```

## With

```ts
import { p } from '@setemiojo/utils'

const items = [1, 2, 3, 4, 5]

await p(items)
  .map(async i => await multiply(i, 3))
  .filter(async i => await isEven(i))
// [6, 12]
```

## Promise Collection

```ts
import { p as P } from '@setemiojo/utils'

const p = P()

// collect promises that are not necessarily needed to be resolved right away
p.add(promiseTask1)

someOtherTasks()

p.add(promiseTask2)
p.add(promiseTask3)

// resolve all collected promises
await p
// => Promise.all([promiseTask1, promiseTask2, promiseTask3])
```

## Concurrency Control

```ts
import { p } from '@setemiojo/utils'

// limits the number of concurrent tasks
await p(myTasks, { concurrency: 5 })
```

## Additional Methods

```ts
import { p } from '@setemiojo/utils'

const items = [1, 2, 3, 4, 5]

// forEach - execute side effects
await p(items)
  .forEach(async (item) => {
    console.log(await processItem(item))
  })

// reduce - accumulate values
const sum = await p(items)
  .map(async i => await multiply(i, 2))
  .reduce((acc, val) => acc + val, 0)

// clear - remove collected promises
const p = P()
p.add(promise1, promise2)
p.clear() // removes all collected promises
```
