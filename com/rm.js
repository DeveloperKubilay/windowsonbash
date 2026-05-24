#!/usr/bin/env node
const rimraf = require('rmdir');
const path = require('path');
const c = require('ansi-colors');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(c.red('Error: No arguments specified'));
  console.log('Usage: rm -rf [file1] [file2] ...');
  process.exit(1);
}

if (args[0] === "-rf" || args[0] === "-r") {
  const files = args.slice(1);

  if (files.length === 0) {
    console.error(c.red('Error: No files specified'));
    console.log('Usage: rm -rf [file1] [file2] ...');
    process.exit(1);
  }

  files.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    rimraf(filePath, (error) => {
      if (error) {
        console.error(c.red(`Error deleting ${file}: ${error.message}`));
      } else {
        console.log(c.green(`Deleted: ${file}`));
      }
    });
  });
} else {
  console.error(c.red('Error: Invalid flag. Use -rf or -r'));
  console.log('Usage: rm -rf [file1] [file2] ...');
  process.exit(1);
}