#!/usr/bin/env node
const c = require('ansi-colors');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

args.forEach(filePath => {
  try {
    const normalizedPath = path.normalize(filePath);
    
    if (fs.existsSync(normalizedPath)) {
      console.log(`${c.red('File already exists:')} ${normalizedPath}`);
    } else {
      fs.writeFileSync(normalizedPath, '');
      console.log(`${c.green('Created file:')} ${normalizedPath}`);
    }
  } catch (error) {
    console.error(`${c.red('Error:')} ${error.message}`);
  }
});
