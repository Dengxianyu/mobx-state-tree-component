import { types } from "mobx-state-tree"
import { MessageEntityModel } from "../../biz-models/multiton/MessageEntity"
import { typeReference } from "../../mobx-scoped"

const MsgItemViewModel = types.model('ImgMsgViewModel', {
  id: types.identifier,
  backgroundColor: types.string,
  messageEntityModel: typeReference(MessageEntityModel)
})
.actions((self) => ({
  onItemClick() {
    // 待实现
  }
}))


export default MsgItemViewModel