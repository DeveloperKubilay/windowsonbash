#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const c = require('ansi-colors');

const args = process.argv.slice(2);
let showHidden = false;
let targetDirs = [];

args.forEach((arg) => {
  if (arg === "-a") {
    showHidden = true;
  } else {
    targetDirs.push(arg);
  }
});

if (targetDirs.length === 0) {
  targetDirs.push(process.cwd());
}

targetDirs.forEach((targetDir, index) => {
  try {
    const dirPath = path.isAbsolute(targetDir) ? targetDir : path.join(process.cwd(), targetDir);

    if (targetDirs.length > 1) {
      if (index > 0) console.log();
      console.log(c.cyan(`${targetDir}:`));
    }

    const files = fs.readdirSync(dirPath);
    const list = [];

    files.forEach((file) => {
      if (!showHidden && file.startsWith('.')) {
        return;
      }

      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      list.push({
        d: stats.isDirectory(),
        id: file
      });
    });

    list.sort((a, b) => {
      if (a.d && !b.d) return -1;
      if (!a.d && b.d) return 1;
      return 0;
    });

    list.forEach((item) => {
      if (item.d) {
        console.log(c.yellow(item.id));
      } else {
        console.log(c.bold.yellow(item.id));
      }
    });

  } catch (error) {
    console.error(c.red(`Error reading directory ${targetDir}: ${error.message}`));
  }
});