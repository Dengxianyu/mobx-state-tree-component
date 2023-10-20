import { types } from "mobx-state-tree";

export const ChatterModel = types.model('ChatterModel', {
  id: types.identifier,
  name: types.string,
  alias: types.string
})
