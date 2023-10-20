import { types } from "mobx-state-tree";

export const AppInfoModel = types.model('AppInfoModel', {
  authInfo: types.model('AuthInfoModel', {
    userId: types.string,
    tenantId: types.string,
  }),
  userSetting: types.model('UserSetting', {}),
})