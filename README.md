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
