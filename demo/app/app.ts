import { AlertTypesConstants, StoreUpdate } from 'nativescript-store-update'
import { Application, Utils } from '@nativescript/core'

StoreUpdate.init({
  majorUpdateAlertType: AlertTypesConstants.FORCE,
  notifyNbDaysAfterRelease: 0,
  alertOptions: {
    title: 'Attention please',
    message: 'Your app is out of date',
  },
})

Application.run({ moduleName: 'main-page' })
