import { VirtualFile } from './VirtualFile'
import { Logger } from './Logger'
import { createLanguageServicePlugin } from '@volar/typescript/lib/quickstart/createLanguageServicePlugin'
import type { LanguagePlugin } from '@volar/language-core'
import type { } from '@volar/typescript'

function isConstJson (filename: string): filename is `${string}.const.json` {
  return filename.endsWith('.const.json')
}

const LANGUAGE_ID = 'json'

export = createLanguageServicePlugin((ts, info) => {
  const projectName = info.project.getProjectName()
  if (!info.project.fileExists(projectName)) {
    // project name not a tsconfig path, this is a inferred project
    return { languagePlugins: [] }
  }

  const logger = Logger.fromInfo(info)

  const plugin: LanguagePlugin<string> = {
    getLanguageId(scriptId) {
      if (isConstJson(scriptId)) {
        return LANGUAGE_ID
      }
    },
    createVirtualCode(scriptId, languageId) {
      if (languageId !== LANGUAGE_ID) return undefined

      const virtualFile = VirtualFile.fromScriptId(scriptId)
      if (virtualFile.error) {
        logger.error(virtualFile.error)
      }
      
      const dts = virtualFile.toString()

      return {
        id: 'main',
        languageId: LANGUAGE_ID,
        snapshot: {
          getText: (start, end) => dts.slice(start, end),
          getLength: () => dts.length,
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
