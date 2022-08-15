<div align="center">

# 👻cache-mocks

Easy to use command line tool for sync-ing your API mocks

[![release version](https://img.shields.io/npm/v/cache-mocks)](https://www.npmjs.com/package/cache-mocks) [![weekly download count](https://img.shields.io/npm/dm/cache-mocks)](https://npmcharts.com/compare/cache-mocks?interval=30&minimal=true) ![primary language procentage](https://img.shields.io/github/languages/top/bartektelec/cache-mocks) ![last commit badge](https://img.shields.io/github/last-commit/bartektelec/cache-mocks) [![licence badge](https://img.shields.io/npm/l/cache-mocks)](https://github.com/bartektelec/cache-mocks/blob/main/LICENSE)

</div>
<hr />

## Requirements

> Node >= v16.15

## Quick start

Generate a `mock-list.js` file for configuration.

```sh
npx cache-mocks --init
```

## Usage

Download fresh mock files and save them

```sh
npx cache-mocks
```

or

```sh
npx cache-mocks --target ./src/mocks --ext js
```

## Options

##### target

`--target <x>`
_Specify a target directory for the mocks to be saved_
Type: `string`
Default: `./mocks`

##### ext

`--ext <x>`
_Specify what file extension the target files should be saved with_
Type: `json | js | ts`
Default: `json`
