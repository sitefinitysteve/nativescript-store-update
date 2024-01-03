const moment = require('moment')
const StoreUpdateModule = require('nativescript-store-update')
import * as platform from '@nativescript/core/platform'
import * as utils from '@nativescript/core/utils'
const StoreUpdate = StoreUpdateModule.StoreUpdate
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const testConstants = require('./tests.constants.spec')

//if (!platform.isAndroid) return;
console.log('##### platform.isAndroid', true);

describe('StoreUpdate ANDROID ', () => {
  beforeAll(() => {
    try {
      StoreUpdate.init(testConstants.config)
    } catch (err) {
      console.log(`StoreUpdate already init in another test`)
    }
  })

  describe('_extendResults function', () => {
    it('returns formated results', () => {
      const results = {
        version: testConstants.environment.appVersion,
        os: testConstants.environment.osVersion,
        date: testConstants.dates.today,
      }
      const extendedResults = {
        currentVersionReleaseDate: results.date,
        minimumOsVersion: results.os,
        systemVersion: android.os.Build.VERSION.RELEASE,
        version: results.version,
      }
      expect(StoreUpdate._extendResults(results)).toEqual(extendedResults)
    })
  })
/*
  describe('_openStore function', () => {
    it('opens store page', () => {
      spyOn(utils, 'openUrl')
      StoreUpdate._openStore()
      expect(utils.openUrl).toHaveBeenCalledWith(testConstants.android.storeURL)
    })
  })*/
})
