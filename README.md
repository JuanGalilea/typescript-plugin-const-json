# typescript-plugin-json-const

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

**BASED ON https://github.com/sapphi-red/typescript-plugin-toml - THANKS FOR THE BASE**

A typescript language service plugin providing support for json files as const.

## Usage

```shell
npm i -D typescript-plugin-json-const # yarn add -D typescript-plugin-json-const
```

And then add this to `tsconfig.json`.

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "typescript-plugin-json-const" }]
  }
}
```

If you're using VSCode, [switch to workspace version](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript).
