const moment = require('moment')
const StoreUpdateModule = require('nativescript-store-update')
const platform = require('@nativescript/core/platform')
const utils = require('@nativescript/core/utils')
const StoreUpdate = StoreUpdateModule.StoreUpdate
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const testConstants = require('./tests.constants.spec')

if (!platform.isIOS) return

describe('StoreUpdate IOS ', () => {
  beforeAll(() => {
    try {
      StoreUpdate.init(testConstants.config)
    } catch (err) {
      console.log(`StoreUpdate already init in another test`)
    }
  })

  it(`can't be init more than once`, () => {
    const newConf = Object.assign({}, testConstants.config, {
      countryCode: 'fr',
    })
    const secondInit = () => StoreUpdate.init(newConf)
    expect(secondInit).toThrow()
  })

  describe('_openStore function', () => {
    it('opens store page', () => {
      StoreUpdate._trackViewUrl = testConstants.ios.trackViewUrl
      const storeURL = NSURL.URLWithString(testConstants.ios.storeURL).absoluteString
      spyOn(utils, 'openUrl')
      StoreUpdate._openStore()
      expect(utils.openUrl).toHaveBeenCalledWith(storeURL)
    })
  })

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
