#!/usr/bin/env node

const c = require('ansi-colors');
const os = require('os');

function formatUptime() {
  const uptime = os.uptime();
  
  const days = Math.floor(uptime / (60 * 60 * 24));
  const hours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  const seconds = Math.floor(uptime % 60);

  let uptimeStr = '';
  if (days > 0) uptimeStr += `${days} ${days === 1 ? 'day' : 'days'}, `;
  if (hours > 0) uptimeStr += `${hours} ${hours === 1 ? 'hour' : 'hours'}, `;
  if (minutes > 0) uptimeStr += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, `;
  uptimeStr += `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;

  return uptimeStr;
}

function displaySystemInfo() {
  const hostname = os.hostname();
  const platform = os.platform();
  const release = os.release();
  const uptime = formatUptime();
  
  console.log(c.cyan('=== System Uptime Information ==='));
  console.log(c.green('Hostname: ') + c.yellow(hostname));
  console.log(c.green('Platform: ') + c.yellow(platform));
  console.log(c.green('OS Release: ') + c.yellow(release));
  console.log(c.green('Uptime: ') + c.yellow(uptime));
  console.log(c.cyan('==============================='));
}

displaySystemInfo();