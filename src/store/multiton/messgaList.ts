import { types } from "mobx-state-tree";
import { PicMessageModel } from "../models/pictureMsgModel";
import { TextMessageModel } from "../models/textMsgModel";

const OneMessageModel = types.union(TextMessageModel, PicMessageModel)

const ListData = types.array(OneMessageModel);

export const MessageListModel = types.model({
  listData: types.array(OneMessageModel),
  focusMsg: types.reference(OneMessageModel)
}).actions((self) => ({
  addFocusMsgId() {
    self.focusMsg = self.listData[`${Number(self.focusMsg.id ) + 1}`];
  }
}))

export const TestMultitonModel = types.model({
  name: types.string,
})