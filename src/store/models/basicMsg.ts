import { types } from "mobx-state-tree";

export const BaseMessageModel = types.model({
  id: types.identifier,
  version: types.string,
  // ...
})