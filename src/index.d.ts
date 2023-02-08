import { IStoreUpdateConfig } from './interfaces'
export * from './constants'
export * from './helpers'
export * from './interfaces'
export declare class StoreUpdate {
  private static _common
  private static _trackViewUrl
  static init(config: IStoreUpdateConfig): void
  static checkForUpdate(): void
  protected static _openStore(): void
  private static _extendResults(result)
}
