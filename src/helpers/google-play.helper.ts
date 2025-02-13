import { GooglePlayConstants } from '../constants'
import { IGoogleStoreResult } from '../interfaces'
import { ResponseHelper } from './'

export class GooglePlayHelper {
  static getAppInfos(bundleId, countryCode?) {
    return GooglePlayHelper._getAppPage(bundleId, countryCode)
      .then(ResponseHelper.handleErrorStatus)
      .then((response) => response.text())
      .then(GooglePlayHelper._parseResource)
  }

  private static _getAppPage(bundleId, countryCode?) {
    return fetch(GooglePlayHelper._getStoreAppUrl(bundleId, countryCode))
  }

  private static _parseResource(page): IGoogleStoreResult {
    const infos: any = {}
    Object.keys(GooglePlayConstants.REGEX).map((key) => {
      // we force a new regex creation to allow multiple calls on the same regex
      const regEx = new RegExp(GooglePlayConstants.REGEX[key].source, 'gm').exec(page)
      infos[key.toLowerCase()] = regEx ? regEx[1] : null
    })
    return infos
  }

  private static _getStoreAppUrl(bundleId, countryCode?): string {
    let url = `${GooglePlayConstants.PLAY_STORE_ROOT_WEB}?id=${bundleId}`
    if (countryCode) {
      url += `&hl=${countryCode}`
    }
    return url
  }
}
