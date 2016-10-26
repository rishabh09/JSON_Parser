const commaParser = (input) => (input[0] === ',') ? [null, input.slice(1)] : null
const spaceParser = (input) => (input.match(/\S/)) ? [null,input.slice(input.indexOf(input.match(/\S/)))] : null
const nullParser = (input) => (input.startsWith(null) && (input[4] === undefined || !input[4].match(/[a-zA-Z0-9]+/gi))) ? [null, input.slice(4)] : null
const numberParser = (input, i) => (i = input.match(/^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i)) ? [parseFloat(i[0]), input.slice(i[0].length)] : null
const boolParser = (input) => (input.startsWith(true)) ? [true, input.slice(4)] : (input.startsWith(false) ? [false, input.slice(5)] : null)

const stringParser = (input, i = 1) => {
  if (!input.startsWith('"')) return null
  while (input[i] !== '"') (input[i] === '\\') ? i = i + 2 : i++
  return [input.substring(1, i), input.slice(i + 1)]
}

const arrayParser = (input) => {
  if (!input.startsWith('[')) return null
  input = spaceParser(input.slice(1))[1]
  var arr = []
  while (true) {
    var temp = anyOneParser(input)
    if (!temp) return null
    arr.push(temp[0])
    input = spaceParser(temp[1])[1]
    if (input.startsWith(']')) break
    input = commaParser(input)
    if (!input) break
    input = input[1]
  }
  return (input) ? [arr, input.slice(1)] : [arr,input]
}

const objectParser = (input) => {
  if (!input.startsWith('{')) return null
  let obj = {}
  input = spaceParser(input.slice(1))[1]
  while (true) {
    var temp = stringParser(input)
    if (!temp) return null
    var [key, value] = temp
    value = spaceParser(value)[1]
    if (value.startsWith(':')) value = value.slice(1)
    value = anyOneParser(value)
    if (!value) return null
    obj[key] = value[0]
    input = spaceParser(value[1])[1]
    if (input.startsWith('}')) break
    let temp2 = commaParser(input)
    if (!temp2) break
    input = spaceParser(temp2[1])[1]
  }
  return (input) ? [obj, input.slice(1)] : [obj, input]
}

const jsonParser = (parsers) => {
  return function(input) {
      for (let i = 0; i < parsers.length; i++){
      input = spaceParser(input)[1]
      let res = parsers[i](input)
      if (res) return res
    }
    return null
  }
}

const inpStr = require('fs').readFileSync('example.txt').toString()
const anyOneParser = jsonParser([nullParser, boolParser, numberParser, stringParser, objectParser, arrayParser])
const output = anyOneParser(inpStr)
output ? console.log(JSON.stringify(output[0], null, 2)) : console.log("Invalid JSON")
