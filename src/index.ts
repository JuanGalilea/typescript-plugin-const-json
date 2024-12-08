import { getDtsContent } from './dtsContent'
import { createLogger } from './logger'
import { createLanguageServicePlugin } from '@volar/typescript/lib/quickstart/createLanguageServicePlugin'
import type { LanguagePlugin } from '@volar/language-core'
import type {} from '@volar/typescript'

const isConstJson = (filename: string): boolean =>
  filename.endsWith('.const.json')

export = createLanguageServicePlugin((ts, info) => {
  const tsConfigPath = info.project.getProjectName()
  if (!info.project.fileExists(tsConfigPath)) {
    // project name not a tsconfig path, this is a inferred project
    return { languagePlugins: [] }
  }

  const logger = createLogger(info)

  const plugin: LanguagePlugin<string> = {
    getLanguageId(scriptId) {
      if (isConstJson(scriptId)) {
        return 'json'
      }
    },
    createVirtualCode(scriptId, languageId) {
      if (languageId !== 'json') return undefined

      const fileName = scriptId.includes('://')
        ? (scriptId.split('://')[1] ?? '')
        : scriptId

      const dtsContent = getDtsContent(fileName, logger)
      return {
        id: 'main',
        languageId: 'const.json',
        snapshot: {
          getText: (start, end) => dtsContent.slice(start, end),
          getLength: () => dtsContent.length,
          getChangeRange: () => undefined
        },
        mappings: []
      }
    },
    typescript: {
      extraFileExtensions: [
        {
          extension: 'json',
          isMixedContent: true,
          scriptKind: ts.ScriptKind.TS
        }
      ],
      getServiceScript(root) {
        return { code: root, extension: '.ts', scriptKind: ts.ScriptKind.TS }
      }
    }
  }

  return { languagePlugins: [plugin] }
})
