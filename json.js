var fs = require('fs')
var data = fs.readFileSync('example.txt')
var inpStr = data.toString()
console.log(inpStr)
