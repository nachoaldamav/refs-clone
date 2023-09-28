const { cloneSync } = require('..');
const { join } = require('path');

function main() {
  const tmpFile = join(__dirname, 'tmp_benchmark_file.dat');
  cloneSync(tmpFile, tmpFile + '.clone');
}

main();
