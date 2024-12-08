import type ts from 'typescript/lib/tsserverlibrary'

const PREFIX = '[typescript-plugin-const-json]'

export class Logger {
  constructor(
    private readonly logger: ts.server.Logger,
    private readonly prefix = PREFIX
  ) {}

  static fromInfo(info: ts.server.PluginCreateInfo) {
    return new this(info.project.projectService.logger)
  }

  private format(...args: unknown[]) {
    return [this.prefix, ...args].join(' ')
  }

  info(...args: unknown[]) {
    this.logger.info(this.format(...args))
  }

  error(e: unknown) {
    this.info(`Failed ${e}`)
    if (e instanceof Error) {
      this.info(`Stack trace: ${e.stack}`)
    }
  }
}
