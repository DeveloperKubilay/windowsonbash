#!/usr/bin/env node

const os = require('os');
const { execSync } = require('child_process');
const c = require('ansi-colors');

function getSystemInfo() {
  const info = {};
  
  info.user = `${os.userInfo().username}@${os.hostname()}`;
  info.os = `Windows ${os.release()}`;
  info.kernel = os.type() + ' ' + os.release();
  info.architecture = os.arch();
  
  const uptimeInSeconds = os.uptime();
  const hours = Math.floor(uptimeInSeconds / 3600);
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
  info.uptime = `${hours} hours, ${minutes} minutes`;
  
  info.cpu = os.cpus()[0].model;
  info.cores = `${os.cpus().length} (${os.cpus()[0].speed} MHz)`;
  
  const totalMemory = Math.round(os.totalmem() / (1024 * 1024 * 1024) * 10) / 10;
  const freeMemory = Math.round(os.freemem() / (1024 * 1024 * 1024) * 10) / 10;
  const usedMemory = (totalMemory - freeMemory).toFixed(1);
  info.memory = `${usedMemory}GB / ${totalMemory}GB`;
  
  try {
    const ramInfo = execSync('powershell "Get-CimInstance -ClassName Win32_PhysicalMemory | Select-Object -First 1 -ExpandProperty Speed"', { encoding: 'utf8' }).trim();
    info.ramSpeed = `${ramInfo} MHz`;
  } catch (e) {
    info.ramSpeed = 'Unknown';
  }
  
  try {
    const gpuName = execSync('powershell "Get-CimInstance -ClassName Win32_VideoController | Select-Object -ExpandProperty Name"', { encoding: 'utf8' }).trim();
    info.gpu = gpuName;

    try {
      const vramBytes = execSync('powershell "(Get-CimInstance -ClassName Win32_VideoController | Select-Object -First 1 -ExpandProperty AdapterRAM)"', { encoding: 'utf8' }).trim();
      const vramGB = Math.round(parseInt(vramBytes) / (1024 * 1024 * 1024) * 10) / 10;
      info.vram = `${vramGB}GB`;
    } catch (e) {
      info.vram = 'Unknown';
    }
    
    try {
      const gpuDetails = execSync('powershell "Get-CimInstance -ClassName Win32_VideoController | Format-List *"', { encoding: 'utf8' });
      const frequencyMatch = gpuDetails.match(/CurrentRefreshRate\s*:\s*(\d+)/i);
      info.gpuRefreshRate = frequencyMatch ? `${frequencyMatch[1]} Hz` : 'Unknown';
    } catch (e) {
      info.gpuRefreshRate = 'Unknown';
    }
  } catch (e) {
    info.gpu = 'Unknown';
    info.vram = 'Unknown';
    info.gpuRefreshRate = 'Unknown';
  }
  
  try {
    info.shell = process.env.SHELL || process.env.COMSPEC || 'Unknown';
  } catch (e) {
    info.shell = 'Unknown';
  }

  try {
    const resolutionInfo = execSync('powershell "Get-CimInstance -ClassName Win32_VideoController | Select-Object CurrentHorizontalResolution,CurrentVerticalResolution"', { encoding: 'utf8' });
    const resolutionMatch = resolutionInfo.match(/(\d+)\s+(\d+)/);
    if (resolutionMatch) {
      info.resolution = `${resolutionMatch[1]}x${resolutionMatch[2]}`;
    } else {
      info.resolution = 'Unknown';
    }
  } catch (e) {
    info.resolution = 'Unknown';
  }
  
  return info;
}

const windowsLogo = [
  '                  ....,,:;+ccllll',
  '      ...,,+:;  cllllllllllllllll',
  '  ,cclllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '                                 ',
  '  llllllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '  llllllllllll  lllllllllllllllll',
  '  `ccllllllll  lllllllllllllllll',
  '      `\'\'\'\'\'\'+  +llllllllllllll',
  '                  `\'\'\'\'\'\'\'\'\'\'\'\'',
];

function displayNeofetch() {
  const info = getSystemInfo();
  const output = [];
  
  const infoLines = [
    `${c.bold(c.cyan(info.user))}`,
    `${c.bold(c.yellow('OS:'))} ${info.os}`,
    `${c.bold(c.yellow('Kernel:'))} ${info.kernel}`,
    `${c.bold(c.yellow('Architecture:'))} ${info.architecture}`,
    `${c.bold(c.yellow('Uptime:'))} ${info.uptime}`,
    `${c.bold(c.yellow('CPU:'))} ${info.cpu}`,
    `${c.bold(c.yellow('Cores:'))} ${info.cores}`,
    `${c.bold(c.yellow('RAM:'))} ${info.memory} (${info.ramSpeed})`,
    `${c.bold(c.yellow('GPU:'))} ${info.gpu}`,
    `${c.bold(c.yellow('VRAM:'))} ${info.vram}`,
    `${c.bold(c.yellow('Shell:'))} ${info.shell}`,
    `${c.bold(c.yellow('Resolution:'))} ${info.resolution} (${info.gpuRefreshRate})`,
  ];
  
  for (let i = 0; i < Math.max(windowsLogo.length, infoLines.length); i++) {
    let line = '';
    if (i < windowsLogo.length) {
      line += c.blue(windowsLogo[i]);
    } else {
      line += ' '.repeat(33);
    }
    
    if (i < infoLines.length) {
      line += '  ' + infoLines[i];
    }
    
    output.push(line);
  }
  
  output.push('');
  output.push(
    c.red('███') +
    c.green('███') +
    c.blue('███') +
    c.yellow('███') +
    c.cyan('███')
  );
  
  console.log(output.join('\n'));
}

displayNeofetch();