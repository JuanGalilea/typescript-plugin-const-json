import { readFileSync } from 'fs'

export class VirtualFile {
  constructor(private readonly json: object, readonly error?: unknown) { }

  static fromScriptId(scriptId: string) {
    return this.fromFileName(
      scriptId.includes('://')
        ? (scriptId.split('://')[1] ?? '')
        : scriptId
    )
  }

  static fromFileName(fileName: string) {
    try {
      const text = readFileSync(fileName, 'utf-8')
      const json = JSON.parse(text)

      return new this(json)
    } catch (error: unknown) {
      return new this(undefined as never, error)
    }
  }

  toString() {
    if (this.error) {
      return `declare const data: never;
export default data;`
    } else {
      return `declare const data = ${this.json} as const;
export default data;`
    }
  }
}
