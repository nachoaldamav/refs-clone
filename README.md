# Windows 11 Dev Drive Reflink Demo

This project serves as a demo to showcase the usage of Copy-on-write (CoW) capabilities within new Windows 11 Development drives. It's built using a combination of C++ for the native operations and Node.js for the JavaScript interface.

> **Note**: I don't have any experience with C++ or Windows development, so this project is probably not the best example of how to do things and is not very well optimized. If you have any suggestions, feel free to open an issue or a pull request.

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

cloneSync('test.txt', 'test2.txt');
```

### Asynchronous Version

```typescript
import { clone } from 'refs2-clone';
import path from 'path';

async function main() {
  await clone('test.txt', 'test2.txt');
}
```

## Benchmarks

Here are some benchmarks comparing the performance of the native addon with the functions `fs.linkSync` and `fs.promises.link` from the Node.js standard library.

```bash
Benchmark 1: node ./benchmarks/clone.js
  Time (mean ± σ):      34.3 ms ±   1.1 ms    [User: 1.9 ms, System: 1.5 ms]
  Range (min … max):    29.4 ms …  36.3 ms    40 runs

Benchmark 2: node ./benchmarks/cloneSync.js
  Time (mean ± σ):      33.2 ms ±   1.5 ms    [User: 2.1 ms, System: 1.4 ms]
  Range (min … max):    28.9 ms …  38.1 ms    43 runs

Benchmark 3: node ./benchmarks/link.js
  Time (mean ± σ):      28.2 ms ±   0.5 ms    [User: 3.2 ms, System: 3.2 ms]
  Range (min … max):    27.3 ms …  29.4 ms    47 runs

Benchmark 4: node ./benchmarks/linkSync.js
  Time (mean ± σ):      27.9 ms ±   0.7 ms    [User: 4.2 ms, System: 4.5 ms]
  Range (min … max):    26.9 ms …  29.5 ms    47 runs

Summary
  'node ./benchmarks/linkSync.js' ran
    1.01 ± 0.03 times faster than 'node ./benchmarks/link.js'
    1.19 ± 0.06 times faster than 'node ./benchmarks/cloneSync.js'
    1.23 ± 0.05 times faster than 'node ./benchmarks/clone.js'
```
