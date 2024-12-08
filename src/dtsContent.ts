import { Logger } from './logger'
import { readFileSync } from 'fs'

export const getDtsContent = (
  fileName: string,
  logger: Logger
): string => {
  const text = readFileSync(fileName, 'utf-8')

  try {
    return `
declare const data = ${JSON.stringify(JSON.parse(text))} as const
export default data
`
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logger.error(e as any)
    return `
declare const data: void
export default data
`
  }
}
