#!/usr/bin/env node
const c = require('ansi-colors');
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(c.red('Error: No time specified'));
  console.log('Usage: sleep <seconds> [-m]');
  console.log('       sleep -m <milliseconds>');
  process.exit(1);
}

const inMs = args.includes('-m');
const timeArgs = args.filter(arg => arg !== '-m');
const time = parseFloat(timeArgs[0]);

if (isNaN(time) || time < 0) {
  console.error(c.red('Error: Please provide a valid positive number'));
  console.log('Usage: sleep <seconds> [-m]');
  console.log('       sleep -m <milliseconds>');
  process.exit(1);
}

const msToSleep = inMs ? time : time * 1000;

setTimeout(() => {
  process.exit(0);
}, msToSleep);