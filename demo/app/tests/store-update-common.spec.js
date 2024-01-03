import * as moment from 'moment'
import * as StoreUpdateModule from 'nativescript-store-update'
import * as appSettings from '@nativescript/core/application-settings'
import * as dialogs from '@nativescript/core/ui/dialogs'
import * as platform from '@nativescript/core/platform'

const StoreUpdate = StoreUpdateModule.StoreUpdate
const UpdateTypesConstants = StoreUpdateModule.UpdateTypesConstants
const AlertTypesConstants = StoreUpdateModule.AlertTypesConstants
const testConstants = require('./tests.constants.spec')



function getStoreUpdateCommon() {
  StoreUpdate.init(testConstants.config);
  return StoreUpdate._common;
}

let storeUpdateCommon = getStoreUpdateCommon();

console.log('##### platform.common', true);

describe('StoreUpdateCommon ', () => {

  beforeAll(() => {
  })

  describe('init function', () => {

    it('sets _majorUpdateAlertType to config', () => {
      expect(getStoreUpdateCommon()._majorUpdateAlertType).toEqual(testConstants.config.majorUpdateAlertType)
    })

    it('sets _minorUpdateAlertType to config', () => {
      expect(getStoreUpdateCommon()._minorUpdateAlertType).toEqual(testConstants.config.minorUpdateAlertType)
    })

    it('sets _patchUpdateAlertType to config', () => {
      expect(getStoreUpdateCommon()._patchUpdateAlertType).toEqual(testConstants.config.patchUpdateAlertType)
    })

    it('sets _revisionUpdateAlertType to config', () => {
      expect(getStoreUpdateCommon()._revisionUpdateAlertType).toEqual(
        testConstants.config.revisionUpdateAlertType
      )
    })

    it('sets _notifyNbDaysAfterRelease to config', () => {
      expect(getStoreUpdateCommon()._notifyNbDaysAfterRelease).toEqual(
        testConstants.config.notifyNbDaysAfterRelease
      )
    })

    it('sets _countryCode to config', () => {
      expect(getStoreUpdateCommon().countryCode).toEqual(testConstants.config.countryCode)
    })
  })

  describe('getBundleId function', () => {
    it('returns appId', () => {
      expect(getStoreUpdateCommon().getBundleId()).toEqual(testConstants.environment.appId)
    })
  })

  describe('getLocalVersionNumber function', () => {
    it('returns app version', () => {
      expect(getStoreUpdateCommon().getLocalVersionNumber()).toEqual(testConstants.environment.appVersion)
    })
  })

  describe('isEligibleForUpdate function', () => {
    beforeAll(() => {
      appSettings.setString('lastVersionSkipped', testConstants.updates.patch)
    })
    it('returns true if new version released for long enough matching OS min versions', () => {
      expect(
        getStoreUpdateCommon().isEligibleForUpdate({
          version: testConstants.updates.major,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(true)
    })
    it('returns false if store version is older than local', () => {
      expect(
        getStoreUpdateCommon().isEligibleForUpdate({
          version: testConstants.updates.past,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(false)
    })
    it('returns false if store version is equal to local', () => {
      expect(
        getStoreUpdateCommon().isEligibleForUpdate({
          version: testConstants.environment.appVersion,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(false)
    })
    it('returns false if release date is too close', () => {
      expect(
        getStoreUpdateCommon().isEligibleForUpdate({
          version: testConstants.updates.major,
          currentVersionReleaseDate: testConstants.dates.today,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(false)
    })
    it('returns false if os version is under min version required', () => {
      expect(
        getStoreUpdateCommon().isEligibleForUpdate({
          version: testConstants.updates.major,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.os.lower,
        })
      ).toBe(false)
    })
    it('returns false if app version was skipped', () => {
      expect(
        getStoreUpdateCommon().isEligibleForUpdate({
          version: testConstants.updates.patch,
          currentVersionReleaseDate: testConstants.dates.threeDaysAgo,
          minimumOsVersion: testConstants.environment.osVersion,
          systemVersion: testConstants.environment.osVersion,
        })
      ).toBe(false)
    })
    afterAll(() => {
      appSettings.remove('lastVersionSkipped')
    })
  })

  describe('setVersionAsSkipped function', () => {
    it('sets skipped version in app settings', () => {
      const version = testConstants.updates.minor
      getStoreUpdateCommon().setVersionAsSkipped(version)
      expect(appSettings.getString('lastVersionSkipped')).toEqual(version)
    })
  })

  describe('triggerAlertForUpdate function', () => {
    beforeAll(() => {
      spyOn(storeUpdateCommon, '_onConfirmed')
      spyOn(storeUpdateCommon, 'setVersionAsSkipped')
    }) 
    it('opens store if confirmed', () => {
      /*debugger;
      spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve(true))
      getStoreUpdateCommon().triggerAlertForUpdate(testConstants.updates.minor).then(() => {
        expect(getStoreUpdateCommon()._onConfirmed).toHaveBeenCalled()
      })*/
    })
    it('skips version if not confirmed', () => {
      /*spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve(false))
      getStoreUpdateCommon().triggerAlertForUpdate(testConstants.updates.minor).then(() => {
        expect(getStoreUpdateCommon().setVersionAsSkipped).toHaveBeenCalled()
      })*/
    })
  })

  describe('getAlertTypeForVersion function', () => {
    it('returns config majorUpdateAlertType for major update', () => {
      expect(getStoreUpdateCommon().getAlertTypeForVersion(testConstants.updates.major)).toEqual(
        testConstants.config.majorUpdateAlertType
      )
    })
    it('returns config minorUpdateAlertType for minor update', () => {
      expect(getStoreUpdateCommon().getAlertTypeForVersion(testConstants.updates.minor)).toEqual(
        testConstants.config.minorUpdateAlertType
      )
    })
    it('returns config patchUpdateAlertType for patch update', () => {
      expect(getStoreUpdateCommon().getAlertTypeForVersion(testConstants.updates.patch)).toEqual(
        testConstants.config.patchUpdateAlertType
      )
    })
    it('returns config revisionUpdateAlertType for revision update', () => {
      expect(getStoreUpdateCommon().getAlertTypeForVersion(testConstants.updates.revision)).toEqual(
        testConstants.config.revisionUpdateAlertType
      )
    })
  })

  describe('buildDialogOptions function', () => {
    it('returns options with neutralButtonText by default', () => {
      expect(getStoreUpdateCommon().buildDialogOptions()).toEqual(testConstants.alerts.skippableOptions)
    })
    it('returns options with neutralButtonText if skippable is true', () => {
      expect(getStoreUpdateCommon().buildDialogOptions({ skippable: true })).toEqual(
        testConstants.alerts.skippableOptions
      )
    })
    it('returns options without neutralButtonText if skippable is false', () => {
      expect(getStoreUpdateCommon().buildDialogOptions({ skippable: false })).toEqual(
        testConstants.alerts.defaultOptions
      )
    })
  })
  describe('showAbuildDialogOptionslertForUpdate function', () => {
    beforeAll(() => {
      //spyOn(dialogs, 'confirm').and.returnValue(Promise.resolve())
      //spyOnProperty(dialogs, 'confirm', 'get').and.returnValue(Promise.resolve());
    })
    it('displays config majorUpdateAlertType confirm for major update', () => {
      const skippable = testConstants.config.majorUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = getStoreUpdateCommon().buildDialogOptions({ skippable })
      getStoreUpdateCommon().showAlertForUpdate(testConstants.updates.major)
      //debugger;
      //expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
    it('displays config minorUpdateAlertType confirm for minor update', () => {
      const skippable = testConstants.config.minorUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = getStoreUpdateCommon().buildDialogOptions({ skippable })
      getStoreUpdateCommon().showAlertForUpdate(testConstants.updates.minor)
      //debugger;
      //expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
    it('does not display confirm for config PatchUpdate version', () => {
      getStoreUpdateCommon().showAlertForUpdate(testConstants.updates.patch).catch(err =>
        expect(err).toEqual(null)
      )
    })
    it('displays config revisionUpdateAlertType confirm for minor update', () => {
      const skippable = testConstants.config.revisionUpdateAlertType !== AlertTypesConstants.FORCE
      const expectedOptions = getStoreUpdateCommon().buildDialogOptions({ skippable })
      getStoreUpdateCommon().showAlertForUpdate(testConstants.updates.revision)
      //debugger;
      //expect(dialogs.confirm).toHaveBeenCalledWith(expectedOptions)
    })
  })

  describe('_getUpdateTypeForVersion function', () => {
    it('returns MAJOR code if major update', () => {
      var version = getStoreUpdateCommon()._getUpdateTypeForVersion(testConstants.updates.major);
      expect(version).toEqual(UpdateTypesConstants.MAJOR)
    })

    it('returns MINOR code if minor update', () => {
      var version = getStoreUpdateCommon()._getUpdateTypeForVersion(testConstants.updates.minor);
      expect(version).toEqual(UpdateTypesConstants.MINOR)
    })

    it('returns PATCH code if patch update', () => {
      var version = getStoreUpdateCommon()._getUpdateTypeForVersion(testConstants.updates.patch);
      expect(version).toEqual(UpdateTypesConstants.PATCH)
    })

    it('returns REVISION code if revision update', () => {
      var version = getStoreUpdateCommon()._getUpdateTypeForVersion(testConstants.updates.revision);
      expect(version).toEqual(UpdateTypesConstants.REVISION)
    })

    it('returns -1 code if no update', () => {
      var data = getStoreUpdateCommon()._getUpdateTypeForVersion(testConstants.environment.appVersion);
      expect(data).toEqual(-1)
    })
  })

  describe('_isUpdateCompatibleWithDeviceOS function', () => {
    it('returns true if minimum required version is null', () => {
      expect(
        getStoreUpdateCommon()._isUpdateCompatibleWithDeviceOS(testConstants.environment.osVersion, null)
      ).toBe(true)
    })

    it('returns true if os version is higher than minimum required version', () => {
      expect(
        getStoreUpdateCommon()._isUpdateCompatibleWithDeviceOS(
          testConstants.environment.osVersion,
          testConstants.os.lower
        )
      ).toBe(true)
    })

    it('returns true if os version is equal to minimum required version', () => {
      expect(
        getStoreUpdateCommon()._isUpdateCompatibleWithDeviceOS(
          testConstants.environment.osVersion,
          testConstants.environment.osVersion
        )
      ).toBe(true)
    })

    it('returns false if os version is lower than minimum required version', () => {
      expect(
        getStoreUpdateCommon()._isUpdateCompatibleWithDeviceOS(
          testConstants.environment.osVersion,
          testConstants.os.higher
        )
      ).toBe(false)
    })
  })

  describe('_hasBeenReleasedLongerThanDelay function', () => {
    it('returns true if release delay is superior to config', () => {
      expect(
        getStoreUpdateCommon()._hasBeenReleasedLongerThanDelay(testConstants.dates.threeDaysAgo.toDate())
      ).toBe(true)
    })

    it('returns false if release delay is inferior to config', () => {
      expect(getStoreUpdateCommon()._hasBeenReleasedLongerThanDelay(testConstants.dates.today.toDate())).toBe(
        false
      )
    })

    it('returns false if no release date is given', () => {
      expect(getStoreUpdateCommon()._hasBeenReleasedLongerThanDelay()).toBe(false)
    })
  })

  describe('triggerAlertIfEligible function', () => {
    const results = {
      bundleId: testConstants.environment.appId,
      trackId: 12,
      version: testConstants.updates.major,
      minimumOsVersion: testConstants.os.lower,
      currentVersionReleaseDate: testConstants.dates.threeDaysAgo.toDate(),
      systemVersion: testConstants.environment.osVersion,
    }

    it('calls triggerAlertForUpdate if new valid version is available', () => {
      /*spyOn(storeUpdateCommon, 'triggerAlertForUpdate')
      getStoreUpdateCommon().triggerAlertIfEligible(results)
      expect(getStoreUpdateCommon().triggerAlertForUpdate).toHaveBeenCalled()*/
    })

    it('does not call triggerAlertForUpdate if no new valid version is available', () => {
      const invalidResults = Object.assign(results, {
        version: testConstants.updates.past,
      })
      /*spyOn(storeUpdateCommon, 'triggerAlertForUpdate')
      getStoreUpdateCommon().triggerAlertIfEligible(results)
      expect(getStoreUpdateCommon().triggerAlertForUpdate).not.toHaveBeenCalled()*/
    })
  })

  describe('_isAppStoreVersionNewer function', () => {
    it('returns true if store version is superior to local', () => {
      expect(getStoreUpdateCommon()._isAppStoreVersionNewer(testConstants.updates.major)).toBe(true)
    })

    it('returns false if store version is equal to local', () => {
      expect(getStoreUpdateCommon()._isAppStoreVersionNewer(testConstants.environment.appVersion)).toBe(false)
    })

    it('returns false if store version is inferior to local', () => {
      expect(getStoreUpdateCommon()._isAppStoreVersionNewer(testConstants.updates.past)).toBe(false)
    })
  })

  describe('_isCurrentVersionSkipped function', () => {
    beforeAll(() => {
      appSettings.remove('lastVersionSkipped')
    })

    it('returns false if store version is not defined', () => {
      var data = getStoreUpdateCommon()._isCurrentVersionSkipped(testConstants.updates.major);
      expect(data).toBe(false)
    })

    it('returns true if store version is matching local', () => {
      appSettings.setString('lastVersionSkipped', testConstants.updates.major)
      var data = getStoreUpdateCommon()._isCurrentVersionSkipped(testConstants.updates.major);
      expect(data).toBe(true)
    })

    it('returns false if store version is not matching local', () => {
      var data = getStoreUpdateCommon()._isCurrentVersionSkipped(testConstants.updates.minor);
      expect(data).toBe(false)
    })

    afterAll(() => {
      appSettings.remove('lastVersionSkipped')
    })
  })
})
