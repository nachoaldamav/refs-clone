const { clone } = require('..');
const { join } = require('path');

async function main() {
  const tmpFile = join(__dirname, 'tmp_benchmark_file.dat');
  await clone(tmpFile, tmpFile + '.clone');
}

main();
