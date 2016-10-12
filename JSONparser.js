const fs = require('fs')
var inpStr = fs.readFileSync('example.txt').toString()
let output = jsonParser(inpStr)
output ? console.log(JSON.stringify(output[0], null, 2)) : console.log("Invalid JSON")

function jsonParser (input) {
  let parsedString
  input = spaceParser(input)[1]
  parsedString = nullParser(input)
  if (parsedString) return parsedString
  parsedString = boolParser(input)
  if (parsedString) return parsedString
  parsedString = numberParser(input)
  if (parsedString) return parsedString
  parsedString = stringParser(input)
  if (parsedString) return parsedString
  parsedString = objectParser(input)
  if (parsedString) return parsedString
  parsedString = arrayParser(input)
  if (parsedString) return parsedString
  return null
}

function commaParser (input) {
  if (input !== undefined && input[0] === ',') {
    input = input.slice(1)
    input = spaceParser(input)[1]
    if(input.startsWith(']') || input.startsWith(']')) return null
  }
  return [null, input]
}

function arrayParser (input) {
  if (input.startsWith('[')) {
    input = input.slice(1)
    input = spaceParser(input)[1]
    var arr = []
    while (input !== undefined && input[0] !== ']') {
      var temp = jsonParser(input)
      arr.push(temp[0])
      input = temp[1]
      input = spaceParser(input)[1]
      let temp1 = commaParser(input)
      if (!temp1) return null
      input = temp1[1]
    }
    if (input !== undefined && input[0] === ']') input = input.slice(1)
    input = spaceParser(input)[1]
    return [arr, input]
  }
  return null
}

function objectParser (input) {
  if (input.startsWith('{')) {
    let obj = {}
    let key, value
    input = input.slice(1)
    while (input !== undefined && input[0] !== '}') {
      input = spaceParser(input)[1]
      var temp = stringParser(input)
      if (temp == null) break
      key = temp[0]
      temp[1] = spaceParser(temp[1])[1]
      if (temp[1].startsWith(':')) temp[1] = temp[1].slice(1)
      value = jsonParser(temp[1])
      obj[key] = value[0]
      value[1] = spaceParser(value[1])[1]
      let temp2 = commaParser(value[1])
      if (!temp2) return null
      input = temp2[1]
    }
    return [obj, input.slice(1)]
  }
  return null
}

function spaceParser (input) {
  while (input !== undefined && (input[0] === ' ' || input[0] === '\n' || input[0] === '\r')) input = input.slice(1)
  return [null,input]
}

function nullParser (input) {
  if (input.startsWith(null) && (input[4] === undefined || !input[4].match(/[a-zA-Z0-9]+/gi))) return [null, input.slice(4)]
  return null
}

function boolParser (input) {
  if (input.startsWith(true) && (input[4] === undefined || !input[4].match(/[a-zA-Z0-9]+/gi))) return [true, input.slice(4)]
  if (input.startsWith(false) && (input[5] === undefined || !input[5].match(/[a-zA-Z0-9]+/gi))) return [false, input.slice(5)]
  return null
}

function numberParser (input) {
  if (input.match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i)) {
    var temp = input.match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i)[0]
    let val = parseFloat(temp.substring(0, temp.length))
    return [val, input.slice(temp.length)]
  }
  return null
}

function stringParser (input) {
  if (input.startsWith('"')) {
    let i = 1
    while (input[i] !== '"') (input[i] === '\\') ? i = i + 2 : i++
  return [input.substring(1, i), input.slice(i + 1)]
  }
  return null
}
