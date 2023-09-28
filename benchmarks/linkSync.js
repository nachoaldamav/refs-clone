const { linkSync: link } = require('fs');
const { join } = require('path');

async function main() {
  const tmpFile = join(__dirname, 'tmp_benchmark_file.dat');
  link(tmpFile, tmpFile + '.clone');
}

main();
