#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const c = require('ansi-colors');

fs.mkdirSync(
    path.join(process.cwd(),process.argv[2])
)
console.log(c.green(process.argv[2] + " Folder Created"))