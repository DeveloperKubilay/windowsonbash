#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  execSync("taskmg.exe", { encoding: 'utf8' });
  console.log("task manager oppened")
} catch (error) {
  console.error('ERR:', error.message);
  process.exit(1);
}
