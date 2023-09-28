import { beforeAll, describe, test, expect, beforeEach } from 'vitest';
import { clone, cloneSync } from '../';
import { join } from 'path';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmdirSync,
  writeFileSync,
} from 'fs';
import { rm } from 'fs/promises';

async function prepareFile(
  target: string,
  content: string,
  encoding: BufferEncoding = 'utf8'
): Promise<void> {
  if (existsSync(target)) {
    await rm(target);
  }

  writeFileSync(target, content, encoding);
}

describe('clone', () => {
  // create a sandbox environment inside a tmp folder
  let sandbox: string;
  beforeAll(() => {
    sandbox = join('node_modules', '.cache', 'tmp-test');
    mkdirSync(sandbox, { recursive: true });
  });

  beforeEach(() => {
    // clean up the sandbox folder before each test
    rmdirSync(sandbox, { recursive: true });
    mkdirSync(sandbox, { recursive: true });
  });

  test('should clone synchronously correctly', async () => {
    const srcFile = join(sandbox, 'sample.txt');
    const dstFile = join(sandbox, 'sample-copy.txt');
    const text = 'Hello World!';

    await prepareFile(srcFile, text);

    if (existsSync(dstFile)) {
      await rm(dstFile);
    }

    cloneSync(srcFile, dstFile);

    const res = readFileSync(dstFile, 'utf8');

    expect(res).toBe(text);
  });

  test('should clone asynchronously correctly', async () => {
    const srcFile = join(sandbox, 'sample.txt');
    const dstFile = join(sandbox, 'sample-copy.txt');
    const text = 'Hello World!';

    await prepareFile(srcFile, text);

    if (existsSync(dstFile)) {
      await rm(dstFile);
    }

    await clone(srcFile, dstFile);

    const res = readFileSync(dstFile, 'utf8');

    expect(res).toBe(text);
  });

  test('should throw an error if src file does not exist', async () => {
    const srcFile = join(sandbox, 'sample.txt');
    const dstFile = join(sandbox, 'sample-copy.txt');

    if (existsSync(srcFile)) {
      await rm(srcFile);
    }

    await expect(clone(srcFile, dstFile)).rejects.toThrow();
  });

  test('should throw an error if the destination file already exists', async () => {
    const srcFile = join(sandbox, 'sample.txt');
    const dstFile = join(sandbox, 'sample-copy.txt');
    const text = 'Hello World!';

    await prepareFile(srcFile, text);
    await prepareFile(dstFile, text);

    await expect(clone(srcFile, dstFile)).rejects.toThrow();
  });

  test('should throw an error if the source and destination files are the same', async () => {
    const srcFile = join(sandbox, 'sample.txt');
    const text = 'Hello World!';

    await prepareFile(srcFile, text);

    await expect(clone(srcFile, srcFile)).rejects.toThrow();
  });

  test('should throw an error if the source file is a directory', async () => {
    const srcFile = join(sandbox, 'sample_dir');
    const dstFile = join(sandbox, 'sample-copy.txt');

    mkdirSync(srcFile, { recursive: true });

    await expect(clone(srcFile, dstFile)).rejects.toThrow();
  });

  test('should throw an error if the destination file dirname does not exist', async () => {
    const srcFile = join(sandbox, 'sample.txt');
    const dstFile = join(
      sandbox,
      "sample-dir-doesn't-exist",
      'sample-copy.txt'
    );
    const text = 'Hello World!';

    await prepareFile(srcFile, text);

    if (existsSync(dstFile)) {
      await rm(dstFile);
    }

    await expect(clone(srcFile, dstFile)).rejects.toThrow();
  });
});
