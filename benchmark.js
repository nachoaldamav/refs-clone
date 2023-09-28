// @ts-check
const Benchmark = require('benchmark');
const { join } = require('path');
const { linkSync, unlinkSync, writeFileSync } = require('fs');
const { link } = require('fs').promises;
const { clone, cloneSync } = require('.');

const suite = new Benchmark.Suite();

// create a tmp file of 1MB
const tmpFile = join(__dirname, 'tmp_benchmark_file.dat');
writeFileSync(tmpFile, Buffer.alloc(1024 * 1024));

// add tests
suite
  .add('clone', {
    defer: true,
    fn: async (deferred) => {
      await clone(tmpFile, tmpFile + '.clone');
      unlinkSync(tmpFile + '.clone');
      deferred.resolve();
    },
  })
  .add('cloneSync', {
    defer: true,
    fn: (deferred) => {
      cloneSync(tmpFile, tmpFile + '.clone');
      unlinkSync(tmpFile + '.clone');
      deferred.resolve();
    },
  })
  .add('link', {
    defer: true,
    fn: async (deferred) => {
      await link(tmpFile, tmpFile + '.clone');
      unlinkSync(tmpFile + '.clone');
      deferred.resolve();
    },
  })
  .add('linkSync', {
    defer: true,
    fn: (deferred) => {
      linkSync(tmpFile, tmpFile + '.clone');
      unlinkSync(tmpFile + '.clone');
      deferred.resolve();
    },
  })
  // add listeners
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    unlinkSync(tmpFile);
  })
  // run async
  .run({ async: true });
