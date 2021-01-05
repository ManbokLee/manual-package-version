#!/usr/bin/env node

var fs = require('fs');
var readline = require('readline');
var jsonData = null;
var choice = null;
var version, newVersions;

function init () {
  fs.readFile('package.json', 'utf8', function (err, data) {
    if (err) {
      return;
    }
    jsonData = JSON.parse(data);
    version = jsonData.version;
    var pure = true;
    var versionsArr = version.split('.');
    var versions = [];
    for (var i = 0; i < versionsArr.length; i++) {
      var item = versionsArr[i];
      if (isNaN(item)) {
        pure = false;
        continue;
      }
      versions.push(item)
    }

    if (versions.length !== 3 || !pure) {
      console.warn('Diff format version');
      return;
    }
    newVersions = {
      first: (Number(versions[0]) + 1) + '.0.0',
      middle: versions[0] + '.' + (Number(versions[1]) + 1) + '.0',
      tail: versions[0] + '.' + Number(versions[1]) + '.' + (Number(versions[2]) + 1)
    }
    viewOptions(version, newVersions);
    inputCommand();
  })
}

function viewOptions () {
  console.log('Set package.json version...');
  console.log('Now version is ' + version);
  console.log('What do you need?');
  console.log('-------------------------------------');
  console.log('1. Update major version => ' + newVersions.first);
  console.log('2. Update minor version => ' + newVersions.middle);
  console.log('3. Update patch version => ' + newVersions.tail);
  console.log('4. None => ' + version);
  console.log('-------------------------------------');
}

function inputCommand () {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('line', function (line) {
    choice = parseInt(line);
    if (choice && choice > 0 && choice < 5) {
      rl.close();
    } else {
      viewOptions();
      console.warn('Wrong choice');
      console.warn('-------------------------------------');
    }
  }).on('close', function () {
    if (choice !== null) {
      updateVersion();
      process.exit();
    }
  })
}

function updateVersion () {
  if (choice === 4) {
    console.log('Not change version.');
    return;
  }
  switch (choice) {
    case 1:
      jsonData.version = newVersions.first;
      break
    case 2:
      jsonData.version = newVersions.middle;
      break
    case 3:
      jsonData.version = newVersions.tail;
      break
  }
  fs.writeFileSync('package.json', JSON.stringify(jsonData, null, 2));
  console.log('Change version to ' + jsonData.version);
}

init();
