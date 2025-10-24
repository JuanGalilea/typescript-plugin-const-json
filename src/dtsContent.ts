import { Logger } from './logger'
import { readFileSync, writeFileSync } from 'fs'

export const getDtsContent = (fileName: string, logger: Logger): string => {
  const text = readFileSync(fileName, 'utf-8')
  const content = JSON.stringify(JSON.parse(text))
  let dts
  try {
    dts = `
declare const data = ${content}${' as const'}
export default data
`
    if (fileName.toLowerCase().endsWith('schema.json')) {
      writeFileSync(fileName.replace('.json', '.d.json.ts'), dts, 'utf-8')
    }
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logger.error(e as any)
    dts = `
declare const data: void
export default data
`
  }
  return dts
}
