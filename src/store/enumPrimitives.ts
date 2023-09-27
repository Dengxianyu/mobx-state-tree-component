// import { AppTheme } from "@lark/types/enumV2"

import { createEnumPrimitive } from "./mstEnhance";

export enum Theme {
  LIGHT,
  DARK
}

export const ThemeEnumPrimitive = createEnumPrimitive(Theme, 'ThemeEnum')