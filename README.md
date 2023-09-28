# Windows 11 Dev Drive Reflink Demo

This project serves as a demo to showcase the usage of Copy-on-write (CoW) capabilities within new Windows 11 Development drives. It's built using a combination of C++ for the native operations and Node.js for the JavaScript interface.

## C++ Source Credit

The C++ code responsible for handling the Copy-on-write operations is borrowed from [0xbadfca11/reflink](https://github.com/0xbadfca11/reflink).

## Prerequisites

- Windows 11 and a Dev drive
- Node.js and npm (pnpm too, but it's optional)
- A C++ compiler compatible with your Node.js version (for building the native addon)

## Installation

1. Clone this repository.

    ```bash
    gh repo clone nachoaldamav/refs-clone
    ```

2. Navigate into the project directory and install dependencies.

    ```bash
    cd refs-clone
    pnpm install
    ```

3. Build the native addon.

    ```bash
    pnpm build && pnpm compile
    ```

4. Run tests.

    ```bash
    pnpm test
    ```

## Usage

### Synchronous Version

```typescript
import { cloneSync } from 'refs2-clone';
import path from 'path';

cloneSync(join(process.cwd(), 'src', 'test.txt'), join(process.cwd(), 'src', 'test2.txt'));
```

### Asynchronous Version

```typescript
import { clone } from 'refs2-clone';
import path from 'path';

async function main() {
  await clone(join(process.cwd(), 'src', 'test.txt'), join(process.cwd(), 'src', 'test2.txt'));
}
```

## Benchmarks

Here are some benchmarks comparing the performance of the native addon with the functions `fs.linkSync` and `fs.promises.link` from the Node.js standard library.

```bash
Benchmark 1: node ./benchmarks/clone.js
  Time (mean ± σ):      34.9 ms ±   2.0 ms    [User: 2.6 ms, System: 4.1 ms]
  Range (min … max):    29.3 ms …  41.9 ms    42 runs

Benchmark 2: node ./benchmarks/cloneSync.js
  Time (mean ± σ):      34.7 ms ±   8.5 ms    [User: 3.2 ms, System: 3.2 ms]
  Range (min … max):    30.0 ms …  88.9 ms    44 runs

  Warning: Statistical outliers were detected. Consider re-running this benchmark on a quiet system without any interferences from other programs.

Benchmark 3: node ./benchmarks/link.js
  Time (mean ± σ):      28.5 ms ±   1.2 ms    [User: 8.5 ms, System: 5.8 ms]
  Range (min … max):    27.2 ms …  35.4 ms    46 runs

  Warning: Statistical outliers were detected. Consider re-running this benchmark on a quiet system without any interferences from other programs.

Benchmark 4: node ./benchmarks/linkSync.js
  Time (mean ± σ):      28.3 ms ±   0.6 ms    [User: 8.2 ms, System: 6.8 ms]
  Range (min … max):    27.3 ms …  31.0 ms    46 runs

Summary
  'node ./benchmarks/linkSync.js' ran
    1.01 ± 0.05 times faster than 'node ./benchmarks/link.js'
    1.23 ± 0.30 times faster than 'node ./benchmarks/cloneSync.js'
    1.23 ± 0.07 times faster than 'node ./benchmarks/clone.js'
```
