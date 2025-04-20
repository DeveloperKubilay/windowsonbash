#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  const command = process.platform === 'win32' ? 'ipconfig' : 'ifconfig';
  const output = execSync(command, { encoding: 'utf8' });
  console.log(output);
} catch (error) {
  console.error('ERR:', error.message);
  process.exit(1);
}
