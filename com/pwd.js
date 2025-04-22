#!/usr/bin/env node
const c = require('ansi-colors');

try {
  const currentDirectory = process.cwd();
  console.log(c.green(currentDirectory));
} catch (error) {
  console.error(c.red('Error getting current directory:'), error.message);
  process.exit(1);
}
