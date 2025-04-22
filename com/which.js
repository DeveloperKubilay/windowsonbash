#!/usr/bin/env node

const { execSync } = require('child_process');
const c = require('ansi-colors');

const command = process.argv[2];

if (!command) {
  console.error(c.red('Error: Please provide a command name'));
  console.error(`Usage: ${c.yellow('which')} ${c.green('<command>')}`);
  process.exit(1);
}

try {
  const result = execSync(`where ${command}`, { encoding: 'utf8' });
  const paths = result.trim().split('\n');
  
  if (paths.length > 0) {
    console.log(c.green(`Found ${paths.length} location(s) for ${c.bold(command)}:`));
    paths.forEach(path => {
      console.log(c.cyan(path));
    });
  } else {
    console.log(c.yellow(`Command ${c.bold(command)} not found`));
  }
} catch (error) {
  console.error(c.red(`Command ${c.bold(command)} not found`));
  process.exit(1);
}
