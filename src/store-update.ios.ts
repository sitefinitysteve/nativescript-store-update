import { Application, Http, Utils } from '@nativescript/core'
import { AppStoreHelper } from './helpers'
import { IAppleStoreResult, IStoreUpdateConfig } from './interfaces'
import { StoreUpdateCommon } from './store-update.common'

export * from './constants'
export * from './helpers'
export * from './interfaces'

export class StoreUpdate {
  private static _common
  private static _trackViewUrl

  //#region Public

  static init(config: IStoreUpdateConfig) {
    if (!StoreUpdate._common) {
      StoreUpdate._common = new StoreUpdateCommon({
        ...config,
        onConfirmed: StoreUpdate._openStore.bind(StoreUpdate),
      })

      // Hook into resume event to check for version
      Application.on(Application.resumeEvent, function (args) {
        StoreUpdate.checkForUpdate()
      })
    }
  }

  static checkForUpdate() {
    if (!StoreUpdate._common) return
    AppStoreHelper.getAppInfos(StoreUpdate._common.getBundleId(), StoreUpdate._common.countryCode)
      .then(StoreUpdate._extendResults)
      .then(StoreUpdate._common.triggerAlertIfEligible.bind(StoreUpdate._common))
      .catch((e) => console.error(e))
  }

  //#endregion Public

  //#region Protected

  protected static _openStore() {
    // App Path
    Utils.openUrl(
      NSURL.URLWithString(`itms-apps${StoreUpdate._trackViewUrl.slice(5)}`).absoluteString
    )
  }

  //#endregion Protected

  //#region Private

  private static _extendResults(result: IAppleStoreResult) {
    StoreUpdate._trackViewUrl = result.trackViewUrl
    return {
      ...result,
      systemVersion: UIDevice.currentDevice.systemVersion,
    }
  }

  //#endregion Private
}
