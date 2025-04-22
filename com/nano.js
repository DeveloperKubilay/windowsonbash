#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const c = require('ansi-colors');
const { exec } = require('child_process');

const filename = process.argv[2];

if (!filename) {
  console.error(c.red('Error: No filename provided'));
  console.log('Usage: nano <filename>');
  process.exit(1);
}

try {
  const filePath = path.resolve(filename);
  if (!fs.existsSync(filePath)) {
    console.log(c.yellow(`File '${filename}' does not exist. Creating a new file...`));
    fs.writeFileSync(filePath, '', 'utf8');
  }

  exec(`code "${filePath}"`, (error) => {
    if (error) {
      exec(`notepad "${filePath}"`, (notepadError) => {
        if (notepadError) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            console.log(c.yellow('File content:'));
            console.log('-------------------------');
            console.log(content);
            console.log('-------------------------');
            console.log(c.gray('Read-only mode. Use a text editor to make changes.'));
          } catch (readError) {
            console.log(c.red('Error reading file content:', readError.message));
          }
        }
      });
    }
  });

} catch (error) {
  console.error(c.red(`Error: ${error.message}`));
  process.exit(1);
}

