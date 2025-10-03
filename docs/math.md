# Math

Utilities for mathematical operations and calculations.

## Basic Math Operations

### clamp

Clamp a number between minimum and maximum values

```ts
import { clamp } from '@setemiojo/utils'

clamp(5, 0, 10) // 5
clamp(-5, 0, 10) // 0
clamp(15, 0, 10) // 10
clamp(3.7, 0, 5) // 3.7
```

### sum

Calculate the sum of numbers

```ts
import { sum } from '@setemiojo/utils'

sum(1, 2, 3, 4, 5) // 15
sum([1, 2, 3], [4, 5]) // 15
sum(10, [20, 30], 40) // 100
```

## Interpolation

### lerp

Linearly interpolate between two values

```ts
import { lerp } from '@setemiojo/utils'

lerp(0, 10, 0) // 0
lerp(0, 10, 0.5) // 5
lerp(0, 10, 1) // 10
lerp(0, 10, 0.3) // 3

// Clamped to [0, 1] range
lerp(0, 10, -0.5) // 0
lerp(0, 10, 1.5) // 10
```

### remap

Remap a value from one range to another

```ts
import { remap } from '@setemiojo/utils'

// Remap from [0, 1] to [0, 100]
remap(0.5, 0, 1, 0, 100) // 50
remap(0, 0, 1, 0, 100) // 0
remap(1, 0, 1, 0, 100) // 100

// Remap from [0, 255] to [0, 1]
remap(128, 0, 255, 0, 1) // 0.5019607843137255

// Remap from [-1, 1] to [0, 360] (for angles)
remap(0, -1, 1, 0, 360) // 180
remap(-1, -1, 1, 0, 360) // 0
remap(1, -1, 1, 0, 360) // 360
```

## Common Use Cases

### Animation and Transitions

```ts
import { lerp, remap } from '@setemiojo/utils'

function animateValue(start: number, end: number, progress: number) {
  return lerp(start, end, progress)
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function animateWithEasing(start: number, end: number, progress: number) {
  const easedProgress = easeInOut(progress)
  return lerp(start, end, easedProgress)
}

// Usage
const startValue = 0
const endValue = 100
const progress = 0.3

const currentValue = animateWithEasing(startValue, endValue, progress)
```

### Color Manipulation

```ts
import { remap, clamp } from '@setemiojo/utils'

function rgbToHsl(r: number, g: number, b: number) {
  const h = remap(r, 0, 255, 0, 360)
  const s = remap(g, 0, 255, 0, 100)
  const l = remap(b, 0, 255, 0, 100)
  
  return { h: clamp(h, 0, 360), s: clamp(s, 0, 100), l: clamp(l, 0, 100) }
}

function normalizeColorComponent(value: number) {
  return clamp(remap(value, 0, 255, 0, 1), 0, 1)
}
```

### Data Normalization

```ts
import { remap, clamp } from '@setemiojo/utils'

function normalizeScore(score: number, minScore: number, maxScore: number) {
  return clamp(remap(score, minScore, maxScore, 0, 1), 0, 1)
}

function denormalizeScore(normalizedScore: number, minScore: number, maxScore: number) {
  return remap(normalizedScore, 0, 1, minScore, maxScore)
}

// Usage
const testScores = [65, 78, 92, 45, 88]
const minScore = Math.min(...testScores) // 45
const maxScore = Math.max(...testScores) // 92

const normalizedScores = testScores.map(score => 
  normalizeScore(score, minScore, maxScore)
)
// [0.43, 0.70, 1.0, 0.0, 0.91]
```

### Progress Calculations

```ts
import { lerp, remap } from '@setemiojo/utils'

function calculateProgress(current: number, total: number) {
  return clamp(current / total, 0, 1)
}

function interpolateProgress(progress: number, startValue: number, endValue: number) {
  return lerp(startValue, endValue, progress)
}

function smoothProgress(rawProgress: number) {
  // Apply smoothing function
  return rawProgress * rawProgress * (3 - 2 * rawProgress)
}

// Usage in UI components
function ProgressBar({ current, total, startValue = 0, endValue = 100 }) {
  const progress = calculateProgress(current, total)
  const smoothProgressValue = smoothProgress(progress)
  const displayValue = interpolateProgress(smoothProgressValue, startValue, endValue)
  
  return { progress: smoothProgressValue, displayValue }
}
```

### Statistical Operations

```ts
import { sum, clamp } from '@setemiojo/utils'

function calculateAverage(numbers: number[]) {
  return sum(...numbers) / numbers.length
}

function calculatePercentage(value: number, total: number) {
  return clamp((value / total) * 100, 0, 100)
}

function normalizeToRange(value: number, min: number, max: number, targetMin: number, targetMax: number) {
  return remap(value, min, max, targetMin, targetMax)
}

// Usage
const grades = [85, 92, 78, 96, 88]
const average = calculateAverage(grades) // 87.8
const percentage = calculatePercentage(87.8, 100) // 87.8
const normalizedGrade = normalizeToRange(87.8, 0, 100, 0, 4) // 3.512 (GPA scale)
```
