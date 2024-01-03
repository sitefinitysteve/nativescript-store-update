const moment = require('moment')
import * as StoreUpdateModule from 'nativescript-store-update'
import * as platform from '@nativescript/core/platform'
import * as utils from '@nativescript/core/utils'
const StoreUpdate = StoreUpdateModule.StoreUpdate
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const testConstants = require('./tests.constants.spec')

console.log('##### platform.isIOS', true);

describe('StoreUpdate IOS ', () => {
  beforeAll(() => {
    try {
      StoreUpdate.init(testConstants.config)
    } catch (err) {
      console.log(`StoreUpdate already init in another test`)
    }
  })

/*
  describe('_openStore function', () => {
    it('opens store page', () => {
      StoreUpdate._trackViewUrl = testConstants.ios.trackViewUrl
      const storeURL = NSURL.URLWithString(testConstants.ios.storeURL).absoluteString
      spyOn(utils, 'openUrl')
      StoreUpdate._openStore()
      expect(utils.openUrl).toHaveBeenCalledWith(storeURL)
    })
  })
*/
  describe('_extendResults function', () => {
    it('returns formated results', () => {
      const results = {
        bundleId: testConstants.environment.appId,
        trackId: 12,
        version: testConstants.environment.appVersion,
        minimumOsVersion: testConstants.environment.osVersion,
        currentVersionReleaseDate: testConstants.dates.today.toDate(),
      }
      const extendedResults = Object.assign(
        {
          systemVersion: testConstants.environment.osVersion,
        },
        results
      )
      expect(StoreUpdate._extendResults(results)).toEqual(extendedResults)
    })
  })
})
