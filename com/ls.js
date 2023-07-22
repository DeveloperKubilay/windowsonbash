#!/usr/bin/env node
const fs = require("fs")
var list = []
const c = require('ansi-colors');
fs.readdirSync(process.cwd()).map((x)=>{
   var xasd = fs.statSync(process.cwd()+"\\"+x)
   if(xasd.isDirectory()){
    list.push({
        d:true,
        id:x
    })
   }else{
    list.push({
        d:false,
        id:x
    })
   }
})

list = list.sort((a, b) => {
    if (a.d && !b.d) {return -1;} else if (!a.d && b.d) {return 1;} else {return 0;}
});
  
list.map((x)=>{
    if(x.d) console.log(c.yellow(x.id));
    else console.log(c.bold.yellow(x.id))
})