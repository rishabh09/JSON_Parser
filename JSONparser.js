'use strict'
const fs = require('fs')
var data = fs.readFileSync('example.txt')
var inpStr = data.toString()
var parsedString = parseEngine(inpStr)
console.log(JSON.stringify(parsedString[0]))

function parseEngine (input) {
  if (input.startsWith('"')) {
    return stringParser(input)
  } else if (input.startsWith('[')) {
    return arrayParser(input)
  } else if (input.startsWith('{')) {
    return objectParser(input)
  } else if (input.startsWith(null)) {
    return nullParser(input)
  } else if (input.startsWith(true) || input.startsWith(false)) {
    return boolParser(input)
  } else if (input.match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i)) {
    return numberParser(input)
  } else {
    return ['Invalid JSON']
  }
}

function nullParser (input) {
  let val = null
  let rem = input.substring(4, input.length)
  return [val, rem]
}

function boolParser (input) {
  if (input.startsWith(true)) {
    let val = true
    let rem = input.substring(4, input.length)
    return [val, rem]
  }
  if (input.startsWith(false)) {
    let val = false
    let rem = input.substring(5, input.length)
    return [val, rem]
  }
  return null
}

function stringParser (input) {
  if (input.startsWith('"')) {
    input = input.slice(1)
    let i = input.indexOf('"')
    let val = input.substring(0, i)
    let rem = input.substring(i + 1, input.length)
    return [val, rem]
  }
  return null
}

function numberParser (input) {
  var temp = input.match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i)[0]
  var i = temp.length
  let val = parseFloat(temp.substring(0, i))
  let rem = input.substring(i, input.length)
  return [val, rem]
}

function objectParser (input) {
  var obj = {}
  var key, value
  if (input.length > 0) {
    input = input.trim()
    if (input.startsWith('{')) {
      input = input.slice(1)
      input = input.trim()
      while (input.length > 0 && !input.startsWith('}')) {
        input = input.trim()
        if (input.startsWith(',')) {
          input = input.slice(1)
          input = input.trim()
        }
        key = stringParser(input)
        if (key == null) {
          break
        }
        input = key[1].trim()
        if (input.startsWith(':')) {
          input = input.slice(1)
          input = input.trim()
        }
        if (input.startsWith(',')) {
          input = input.slice(1)
          input = input.trim()
        }
        value = parseEngine(input)
        obj[key[0]] = value[0]
        input = value[1].trim()
      }
      return [obj, input.substring(1, input.length)]
    }
    return null
  }
  return null
}
function arrayParser (input) {
  var arr = []
  input = input.slice(1)
  while (input.length > 0 && !input.startsWith(']')) {
    input = input.trim()
    if (input.startsWith(',')) {
      input = input.slice(1)
      input = input.trim()
    }
    if (input.startsWith('[')) {
      var i = input.indexOf(']')
      arr.push(parseEngine(input))
      input = input.substring(i, input.length)
    } else {
      let parsed = parseEngine(input)
      if (parsed === null || parsed[1] === '') {
        break
      }
      arr.push(parsed[0])
      input = parsed[1]
                  //  console.log(input);
          //  if (input.startsWith(",")) {
            //    input = input.slice(1);
              //  input = input.trim();
              //  console.log(x);
  //          }
    }
  }
  if (input.startsWith(',')) {
    input = input.slice(1)
    input = input.trim()
      //  console.log(x);
  }
  return [arr, input.slice(1)]
}
