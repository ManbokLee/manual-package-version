# Manual package version

> When you use the package, you choose how you want to change the version.   
The changed version will be saved according to the type you select.

## Warning
- this package is change version in package.json file. 

### Supported formats version
- format: [major version number].[minor version number].[patch version number]

### Install
```
npm install manual-package-version
yarn add manual-package-version
```

### How to use
- NPX
```
npx manual-package-version
```
- scripts in package.json
```
{
  "scripts" : {
    "update:version": "npx manual-package-version",
    "deploy": "yarn update:version && [your deploy scripts]"
  }
}
```

### Tests
Clone the repo, and run npm test

### Todo list
- Support formats of different types.
- use arguments
