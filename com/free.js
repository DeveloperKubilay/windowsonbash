#!/usr/bin/env node

const os = require('os');
const { execSync } = require('child_process');

function bytesToMB(bytes) {
  return Math.round(bytes / (1024 * 1024));
}

function padRight(str, width) {
  return String(str).padEnd(width);
}

function padLeft(str, width) {
  return String(str).padStart(width);
}

function getSwapInfo() {
  try {
    const command = 'powershell -command "Get-WmiObject -Class Win32_PageFileUsage | Select-Object AllocatedBaseSize, CurrentUsage | ConvertTo-Json"';
    const result = execSync(command, { encoding: 'utf-8' });
    
    const pageFileInfo = JSON.parse(result);
    
    if (Array.isArray(pageFileInfo)) {
      let totalSwap = 0;
      let usedSwap = 0;
      
      pageFileInfo.forEach(pf => {
        totalSwap += pf.AllocatedBaseSize || 0;
        usedSwap += pf.CurrentUsage || 0;
      });
      
      return { total: totalSwap, used: usedSwap, free: totalSwap - usedSwap };
    } else if (pageFileInfo) {
      const totalSwap = pageFileInfo.AllocatedBaseSize || 0;
      const usedSwap = pageFileInfo.CurrentUsage || 0;
      return { total: totalSwap, used: usedSwap, free: totalSwap - usedSwap };
    }
    return { total: 0, used: 0, free: 0 };
  } catch (error) {
    return { total: 0, used: 0, free: 0 };
  }
}


function getCachedMemory() {
  try {
    const command = 'powershell -command "Get-WmiObject -Class Win32_PerfFormattedData_PerfOS_Memory | Select-Object SystemCacheResidentBytes | ConvertTo-Json"';
    const result = execSync(command, { encoding: 'utf-8' });
    const cacheInfo = JSON.parse(result);

    return bytesToMB(cacheInfo.SystemCacheResidentBytes || 0);
  } catch (error) {
    return 0;
  }
}

const totalMem = bytesToMB(os.totalmem());
const freeMem = bytesToMB(os.freemem());
const usedMem = totalMem - freeMem;
const swapInfo = getSwapInfo();
const buffersMem = getCachedMemory();
const sharedMem = 0; 
const availableMem = freeMem + buffersMem; 

const colWidth = 10;
const firstColWidth = 14;

console.log(`${padRight('', firstColWidth)}${padLeft('total', colWidth)}${padLeft('used', colWidth)}${padLeft('free', colWidth)}${padLeft('shared', colWidth)}  ${padLeft('buff/cache', colWidth)}${padLeft('available', colWidth)}`);
console.log(`${padRight('Mem:', firstColWidth)}${padLeft(totalMem, colWidth)}${padLeft(usedMem, colWidth)}${padLeft(freeMem, colWidth)}${padLeft(sharedMem, colWidth)}  ${padLeft(buffersMem, colWidth)}${padLeft(availableMem, colWidth)}`);
console.log(`${padRight('Swap:', firstColWidth)}${padLeft(swapInfo.total, colWidth)}${padLeft(swapInfo.used, colWidth)}${padLeft(swapInfo.free, colWidth)}`);