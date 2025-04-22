#!/usr/bin/env node
const c = require('ansi-colors');
const args = process.argv.slice(2);

const inMs = args.includes('-m');
let time = parseFloat(args[0]);

if (isNaN(time) || time < 0) {
  console.error(c.red('Error: Please provide a valid positive number'));
  process.exit(1);
}


const msToSleep = inMs ? time : time * 1000;


setTimeout(() => {
  process.exit(0);
}, msToSleep);