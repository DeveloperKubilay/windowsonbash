#!/usr/bin/env node

const { execSync } = require('child_process');
const c = require('ansi-colors');

try {
  console.log(c.green("task manager oppened"))
  execSync("taskmgr", { encoding: 'utf8' });
} catch (error) {
  console.error('ERR:', error.message);
  process.exit(1);
}
