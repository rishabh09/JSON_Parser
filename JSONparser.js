'use strict'
const fs = require('fs')
var data = fs.readFileSync('example.txt')
var inpStr = data.toString()
var parsedString = jsonParser(inpStr)
console.log(JSON.stringify(parsedString[0], null, 2))

// JSON PARSER
function jsonParser (input) {
  let parsedString
  parsedString = nullParser(input)
  if (parsedString !== null) {
    return parsedString
  }
  parsedString = boolParser(input)
  if (parsedString !== null) {
    return parsedString
  }
  parsedString = numberParser(input)
  if (parsedString !== null) {
    return parsedString
  }
  parsedString = stringParser(input)
  if (parsedString !== null) {
    return parsedString
  }
  parsedString = objectParser(input)
  if (parsedString !== null) {
    return parsedString
  }
  parsedString = arrayParser(input)
  if (parsedString !== null) {
    return parsedString
  }
  return ['Invalid JSON']
}

//  COMMA PARSER
function commaParser (input) {
  input = spaceParser(input)
  if (input !== undefined && input[0] === ',') {
    input = input.slice(1)
    input = spaceParser(input)
  }
  return input
}

//  ARRAY PARSER
function arrayParser (input) {
  input = spaceParser(input)
  if (input.startsWith('[')) {
    input = input.slice(1)
    input = spaceParser(input)
    var arr = []
    while (input !== undefined && input[0] !== ']') {
      var temp = jsonParser(input)
      arr.push(temp[0])
      input = temp[1]
      input = commaParser(input)
    }
    if (input !== undefined && input[0] === ']') {
      input = input.slice(1)
    }
    input = spaceParser(input)

    return [arr, input]
  }
  return null
}

// OBJECT PARSER
function objectParser (input) {
  input = spaceParser(input)
  if (input.startsWith('}')) {
    input = input.slice(1)
    input = commaParser(input)
  }
  if (input.startsWith('{')) {
    let obj = {}
    let key, value
    input = input.slice(1)
    while (input !== undefined && input[0] !== '}') {
      var temp = stringParser(input)
      if (temp == null) {
        break
      }
      key = temp[0]
      temp[1] = spaceParser(temp[1])
      if (temp[1].startsWith(':')) {
        temp[1] = temp[1].slice(1)
        temp[1] = spaceParser(temp[1])
      }
      value = jsonParser(temp[1])
      obj[key] = value[0]
      input = commaParser(value[1])
    }
    return [obj, input.slice(1)]
  }
  return null
}

// SPACE PARSESR
function spaceParser (input) {
  while (input !== undefined && (input[0] === ' ' || input[0] === '\n' || input[0] === '\r')) {
    input = input.slice(1)
  }
  return input
}

// NULL PARSER
function nullParser (input) {
  input = spaceParser(input)
  if (input.startsWith(null) && (input[4] === undefined || !input[4].match(/[a-zA-Z0-9]+/gi))) {
    return [null, input.slice(4)]
  }
  return null
}

// BOOLEAN PARSER
function boolParser (input) {
  input = spaceParser(input)
  if (input.startsWith(true) && (input[4] === undefined || !input[4].match(/[a-zA-Z0-9]+/gi))) {
    return [true, input.slice(4)]
  }
  if (input.startsWith(false) && (input[5] === undefined || !input[5].match(/[a-zA-Z0-9]+/gi))) {
    return [false, input.slice(5)]
  }
  return null
}

// NUMBER PARSER
function numberParser (input) {
  input = spaceParser(input)
  if (input.match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i)) {
    var temp = input.match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i)[0]
    var i = temp.length
    let val = parseFloat(temp.substring(0, i))
    let rem = input.substring(i, input.length)
    return [val, rem]
  }
  return null
}
// STRING PARSER
function stringParser (input) {
  input = spaceParser(input)
  if (input.startsWith('"')) {
    let i = 1
    while (input[i] !== '"') {
      if (input[i] === '\\') {
        i = i + 2
      } else {
        i++
      }
    }
    let string = input.substring(1, i)
    let rem = input.substring(i + 1, input.length)
    return [string, rem]
  }
  if (input.startsWith('\'')) {
    let i = 1
    while (input[i] !== '\'') {
      if (input[i] === '\\') {
        i = i + 2
      } else {
        i++
      }
    }
    let rem = input.substring(i + 1, input.length)
    let string = input.substring(1, i)
    return [string, rem]
  }
  return null
}
