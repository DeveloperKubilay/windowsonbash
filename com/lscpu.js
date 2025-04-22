#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  const output = execSync("systeminfo", { encoding: 'utf8' });
  console.log(output);
} catch (error) {
  console.error('ERR:', error.message);
  process.exit(1);
}
