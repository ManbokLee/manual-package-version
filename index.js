const fs = require('fs')
const readline = require('readline')
let jsonData = null
let choice = null
let version, newVersions

function init () {
  fs.readFile('package.json', 'utf8', function (err, data) {
    if (err) {
      return
    }
    jsonData = JSON.parse(data)
    version = jsonData.version
    let pure = true
    const versions = version.split('.').reduce((acc, cur) => {
      const num = cur.replace(/[^\d]/g, '')
      if (isNaN(num)) {
        pure = false
        return acc
      }
      acc.push(num)
      return acc
    }, [])

    if (versions.length !== 3 || !pure) {
      console.warn('Diff format version')
      return
    }
    newVersions = {
      first: `${Number(versions[0]) + 1}.${versions[1]}.${versions[2]}`,
      middle: `${versions[0]}.${Number(versions[1]) + 1}.${versions[2]}`,
      tail: `${versions[0]}.${versions[1]}.${Number(versions[2]) + 1}`
    }
    viewOptions(version, newVersions)
    inputCommand()
  })
}

function viewOptions () {
  console.log('Set package.json version...')
  console.log('Now version is ' + version)
  console.log('What you need?')
  console.log('-------------------------------------')
  console.log('1. Update main version => ' + newVersions.first)
  console.log('2. Update middle version => ' + newVersions.middle)
  console.log('3. Update tail version => ' + newVersions.tail)
  console.log('4. None => ' + version)
  console.log('-------------------------------------')
}

function inputCommand () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.on('line', function (line) {
    choice = parseInt(line)
    if (choice && choice > 0 && choice < 5) {
      rl.close()
    } else {
      viewOptions()
      console.warn('Wrong choice')
      console.warn('-------------------------------------')
    }
  }).on('close', function () {
    if (choice !== null) {
      updateVersion()
      process.exit()
    }
  })
}

function updateVersion () {
  if (choice === 4) {
    console.log('Not change version.')
    return
  }
  switch (choice) {
    case 1:
      jsonData.version = newVersions.first
      break
    case 2:
      jsonData.version = newVersions.middle
      break
    case 3:
      jsonData.version = newVersions.tail
      break
  }
  fs.writeFileSync('package.json', JSON.stringify(jsonData, null, 2))
  console.log('Change version to ' + jsonData.version)
}

if (require.main === module) {
  init()
}

module.exports = init
