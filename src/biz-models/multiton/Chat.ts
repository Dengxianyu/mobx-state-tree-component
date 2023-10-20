import { types } from "mobx-state-tree";
import { typeReference } from "../../mobx-scoped";
import { ChatterModel } from "./Chatter";

export const ChatModel = types.model('ChatModel', {
  id: types.identifier,
  name: types.string,
  ownerId: typeReference(ChatterModel),
})