import { types } from 'mobx-state-tree';
import { Theme, ThemeEnumPrimitive } from '../enumPrimitives';

const AppStatesModel = types.model({
  theme: types.optional(ThemeEnumPrimitive, Theme.LIGHT),
  // contentTheme:
  // netStatus:
  // timeFormat: 
  // timeZone: 
}).actions((self) => ({
  setTheme(theme: Theme) {
    self.theme = theme;
  }
}));

const appStatesModel = AppStatesModel.create({
  theme: Theme.LIGHT,
});

export default appStatesModel
