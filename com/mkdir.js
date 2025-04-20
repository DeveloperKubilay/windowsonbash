#!/usr/bin/env node
const fs = require("fs")
const path = require("path")

fs.mkdirSync(
    path.join(process.cwd(),process.argv[2])
)
console.log(process.argv[2]," Folder Created")