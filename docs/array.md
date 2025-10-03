# Array

Utilities for working with arrays and array-like objects.

## Array Conversion

### toArray

Convert `Arrayable<T>` to `Array<T>`

```ts
import { toArray } from '@setemiojo/utils'

toArray([1, 2, 3]) // [1, 2, 3]
toArray(1) // [1]
toArray(null) // []
toArray(undefined) // []
```

### flattenArrayable

Convert `Arrayable<T>` to `Array<T>` and flatten it

```ts
import { flattenArrayable } from '@setemiojo/utils'

flattenArrayable([1, [2, 3], 4]) // [1, 2, 3, 4]
flattenArrayable(1) // [1]
```

### mergeArrayable

Use rest arguments to merge arrays

```ts
import { mergeArrayable } from '@setemiojo/utils'

mergeArrayable([1, 2], [3, 4], 5) // [1, 2, 3, 4, 5]
mergeArrayable('a', ['b', 'c']) // ['a', 'b', 'c']
```

## Array Manipulation

### partition

Divide an array into multiple parts by filter functions

```ts
import { partition } from '@setemiojo/utils'

const numbers = [1, 2, 3, 4, 5, 6]

// Two-way partition
const [odd, even] = partition(numbers, n => n % 2 !== 0)
// odd: [1, 3, 5], even: [2, 4, 6]

// Three-way partition
const [small, medium, large] = partition(
  numbers,
  n => n < 3,
  n => n < 5
)
// small: [1, 2], medium: [3, 4], large: [5, 6]
```

### uniq

Remove duplicates from an array

```ts
import { uniq } from '@setemiojo/utils'

uniq([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
uniq(['a', 'b', 'a', 'c']) // ['a', 'b', 'c']
```

### uniqueBy

Remove duplicates by a custom equality function

```ts
import { uniqueBy } from '@setemiojo/utils'

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'Johnny' }
]

uniqueBy(users, (a, b) => a.id === b.id)
// [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

### remove

Remove an item from an array (mutates the array)

```ts
import { remove } from '@setemiojo/utils'

const arr = [1, 2, 3, 4, 5]
remove(arr, 3) // true, arr is now [1, 2, 4, 5]
remove(arr, 6) // false, arr unchanged
```

### move

Move an element from one position to another (mutates the array)

```ts
import { move } from '@setemiojo/utils'

const arr = [1, 2, 3, 4, 5]
move(arr, 0, 3) // [2, 3, 4, 1, 5] - moved 1 from index 0 to index 3
```

### shuffle

Shuffle an array in place (mutates the array)

```ts
import { shuffle } from '@setemiojo/utils'

const arr = [1, 2, 3, 4, 5]
shuffle(arr) // [3, 1, 5, 2, 4] (random order)
```

### filterInPlace

Filter out items from an array in place (mutates the array)

```ts
import { filterInPlace } from '@setemiojo/utils'

const arr = [1, 2, 3, 4, 5, 6]
filterInPlace(arr, n => n % 2 === 0) // [2, 4, 6]
```

## Array Access

### at

Get nth item of array with negative index support

```ts
import { at } from '@setemiojo/utils'

const arr = [1, 2, 3, 4, 5]

at(arr, 0) // 1
at(arr, -1) // 5
at(arr, -2) // 4
at(arr, 10) // undefined
```

### last

Get the last item from an array

```ts
import { last } from '@setemiojo/utils'

last([1, 2, 3, 4, 5]) // 5
last([]) // undefined
```

### sample

Get random item(s) from an array

```ts
import { sample } from '@setemiojo/utils'

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

sample(arr, 1) // [7] (random single item)
sample(arr, 3) // [2, 9, 5] (random 3 items)
```

## Array Generation

### range

Generate a range array of numbers

```ts
import { range } from '@setemiojo/utils'

range(5) // [0, 1, 2, 3, 4]
range(1, 5) // [1, 2, 3, 4]
range(0, 10, 2) // [0, 2, 4, 6, 8]
range(10, 0, -2) // [10, 8, 6, 4, 2]
```

## Array Utilities

### clampArrayRange

Clamp a number to the index range of an array

```ts
import { clampArrayRange } from '@setemiojo/utils'

const arr = ['a', 'b', 'c', 'd', 'e']

clampArrayRange(-1, arr) // 0
clampArrayRange(2, arr) // 2
clampArrayRange(10, arr) // 4
```
