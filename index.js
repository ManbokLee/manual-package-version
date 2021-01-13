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
      major: (Number(versions[0]) + 1) + '.0.0',
      minor: versions[0] + '.' + (Number(versions[1]) + 1) + '.0',
      patch: versions[0] + '.' + versions[1] + '.' + (Number(versions[2]) + 1)
    }
    viewOptions();
    inputCommand();
  })
}

function viewOptions () {
  console.log('Set package.json version...');
  console.log('Now version is ' + version);
  console.log('What do you need?');
  console.log('-------------------------------------');
  console.log('1. Update major version => ' + newVersions.major);
  console.log('2. Update minor version => ' + newVersions.minor);
  console.log('3. Update patch version => ' + newVersions.patch);
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
      jsonData.version = newVersions.major;
      break
    case 2:
      jsonData.version = newVersions.minor;
      break
    case 3:
      jsonData.version = newVersions.patch;
      break
  }
  fs.writeFileSync('package.json', JSON.stringify(jsonData, null, 2));
  console.log('Change version to ' + jsonData.version);
}

init();
