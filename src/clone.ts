import { promisify } from 'util';
// @ts-expect-error
import addon from '../build/Release/reflinkAddon.node';
import { ReflinkStatusCodes, getErrorMessage } from './errors';

type ReflinkAddon = {
  reflink(src: string, dest: string): ReflinkStatusCodes;
};

const { reflink } = addon as ReflinkAddon;

async function myReflinkAsync(
  src: string,
  dest: string
): Promise<ReflinkStatusCodes> {
  return new Promise((resolve, reject) => {
    try {
      const code = reflink(src, dest);
      resolve(code);
    } catch (e) {
      reject(e);
    }
  });
}

export function cloneSync(src: string, dest: string): void {
  const code = reflink(src, dest);
  if (code !== ReflinkStatusCodes.Success) {
    throw new Error(getErrorMessage(code, src, dest));
  }
}

export async function clone(src: string, dest: string): Promise<void> {
  const code = await myReflinkAsync(src, dest);
  if (code !== ReflinkStatusCodes.Success) {
    throw new Error(getErrorMessage(code, src, dest));
  }
}
