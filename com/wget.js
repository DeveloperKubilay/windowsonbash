#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const url = require('url');
const dns = require('dns');
const util = require('util');
const dnsLookup = util.promisify(dns.lookup);

const args = process.argv.slice(2);
let targetUrl = '';
let outputFile = '';

for (let i = 0; i < args.length; i++) {
    if (args[i] === '-O' && i + 1 < args.length) {
        outputFile = args[i + 1];
        i++;
    } else if (!targetUrl && !args[i].startsWith('-')) {
        targetUrl = args[i];
    }
}

if (!targetUrl) {
    console.error('wget: missing URL');
    console.error('Usage: wget [OPTIONS] URL');
    process.exit(1);
}

if (!outputFile) {
    const parsedUrl = url.parse(targetUrl);
    outputFile = path.basename(parsedUrl.pathname) || 'index.html';
}

function formatDate() {
    const date = new Date();
    return date.toISOString().replace('T', ' ').substring(0, 19);
}

function formatSize(bytes) {
    if (bytes === 0) return '0B';
    const units = ['B', 'K', 'M', 'G', 'T'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)}${units[i]}`;
}

function createProgressBar(percentage, width = 50) {
    const completed = Math.round(width * percentage / 100);
    const remaining = width - completed;
    return '[' + '='.repeat(completed) + ' '.repeat(remaining) + ']';
}

async function download() {
    const startTime = Date.now();
    console.log(`--${formatDate()}--  ${targetUrl}`);
    
    try {
        const parsedUrl = new URL(targetUrl);
        const hostname = parsedUrl.hostname;
        
        console.log(`Resolving ${hostname} (${hostname})...`);
        const { address } = await dnsLookup(hostname);
        console.log(`Connecting to ${hostname} (${hostname})|${address}|:${parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80)}... connected.`);
        
        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        
        const request = protocol.get(targetUrl, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                const newUrl = response.headers.location;
                console.log(`Location: ${newUrl} [following]`);
                args[args.indexOf(targetUrl)] = newUrl;
                process.argv = ['node', 'wget.js', ...args];
                require('./wget');
                return;
            }

            console.log(`HTTP request sent, awaiting response... ${response.statusCode} ${response.statusMessage}`);
            
            const contentLength = parseInt(response.headers['content-length'], 10) || 0;
            const contentType = response.headers['content-type'] || '';
            
            if (contentLength) {
                console.log(`Length: ${contentLength} (${formatSize(contentLength)}) [${contentType}]`);
            } else {
                console.log(`Length: unspecified [${contentType}]`);
            }
            
            console.log(`Saving to: '${outputFile}'`);
            console.log();
            
            const fileStream = fs.createWriteStream(outputFile);
            let downloadedBytes = 0;
            
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                fileStream.write(chunk);
                
                if (contentLength > 0) {
                    const percentage = Math.floor((downloadedBytes / contentLength) * 100);
                    const progressBar = createProgressBar(percentage);
                    const formattedSize = formatSize(downloadedBytes);
                    process.stdout.write(`\r${outputFile.padEnd(40)} ${percentage}%${progressBar} ${formattedSize}`);
                } else {
                    process.stdout.write(`\r${downloadedBytes} bytes received`);
                }
            });
            
            response.on('end', () => {
                fileStream.end();
                const endTime = Date.now();
                const duration = (endTime - startTime) / 1000;
                const speedInBytesPerSec = downloadedBytes / duration;
                console.log();
                console.log();
                console.log(`${formatDate()} (${formatSize(speedInBytesPerSec)}/s) - '${outputFile}' saved [${downloadedBytes}/${contentLength || downloadedBytes}]`);
            });
        }).on('error', (err) => {
            console.error(`wget: error: ${err.message}`);
            process.exit(1);
        });
    } catch (error) {
        console.error(`wget: error: ${error.message}`);
        process.exit(1);
    }
}

download();
