const { link } = require('fs').promises;
const { join } = require('path');

async function main() {
  const tmpFile = join(__dirname, 'tmp_benchmark_file.dat');
  await link(tmpFile, tmpFile + '.clone');
}

main();
