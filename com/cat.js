#!/usr/bin/env node
const c = require('ansi-colors');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(c.red('Error: No files specified'));
  console.log('Usage: cat [file1] [file2] ...');
  process.exit(1);
}


args.forEach((filePath, index) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (index > 0) {
      process.stdout.write('\n');
    }
    process.stdout.write(content);
  } catch (err) {
    console.error(c.red(`Error reading file ${filePath}: ${err.message}`));
  }
});