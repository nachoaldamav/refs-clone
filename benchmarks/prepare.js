const { join } = require('path');
const { writeFileSync, unlinkSync, existsSync } = require('fs');

const tmpFile = join(__dirname, 'tmp_benchmark_file.dat');
writeFileSync(tmpFile, Buffer.alloc(1024 * 1024));

if (existsSync(tmpFile + '.clone')) {
  unlinkSync(tmpFile + '.clone');
}
