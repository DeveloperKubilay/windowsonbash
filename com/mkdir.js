#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const c = require('ansi-colors');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(c.red('Error: No directories specified'));
  console.log('Usage: mkdir [-p] [dir1] [dir2] ...');
  process.exit(1);
}

let recursive = false;
let directories = [];

if (args[0] === "-p") {
  recursive = true;
  directories = args.slice(1);
} else {
  directories = args;
}

if (directories.length === 0) {
  console.error(c.red('Error: No directories specified'));
  console.log('Usage: mkdir [-p] [dir1] [dir2] ...');
  process.exit(1);
}

directories.forEach((dir) => {
  try {
    const dirPath = path.join(process.cwd(), dir);
    fs.mkdirSync(dirPath, { recursive: recursive });
    console.log(c.green(`Created: ${dir}`));
  } catch (error) {
    console.error(c.red(`Error creating ${dir}: ${error.message}`));
  }
});