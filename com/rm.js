#!/usr/bin/env node
const rimraf = require('rmdir');
const c = require('ansi-colors');
if(process.argv[2] == "-rf"){
    rimraf(process.cwd()+"\\"+process.argv[3], (error) => {
    if(error){
        console.log(c.red("ERORR"))
    }else{
        console.log(c.green("File deleted "+process.argv[3]))
    }
 })
}