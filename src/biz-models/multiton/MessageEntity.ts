import { types } from "mobx-state-tree";
import { unionMsgContent } from "./MessageType";
import { getScope, typeReference } from "../../mobx-scoped";
import { ChatterModel } from "./Chatter";
import { AppInfoModel } from "../singleton/AppInfo";

export const MessageEntityModel = types.model('MessageEntityModel', {
  id: types.identifier,
  content: unionMsgContent,
  sender: typeReference(ChatterModel),
  hasFlag: false,
  hasPin: false
})
.views((self) => ({
  get isSentByMe() {
    const store = getScope(self);
    return self.sender.id === store.get(AppInfoModel)?.authInfo.userId
  },

  isSenderBy(chatterId: string) {
    return self.sender.id === chatterId
  }
}))
.actions((self) => ({
  toggleFlag() {
    self.hasFlag = !self.hasFlag
  },

  togglePin() {
    self.hasPin = !self.hasPin
  }
}))
