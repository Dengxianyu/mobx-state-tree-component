import { types } from "mobx-state-tree"
import { GroupThreadMessageItemEnumModel } from "../../biz-models/enum"
import { ChatModel } from "../../biz-models/multiton/Chat"
import { typeReference } from "../../mobx-scoped"

export const MessageItemIdTypeMapModel = types.model('MessageItemIdTypeMapModel', {
  itemId: types.identifier,
  itemType: GroupThreadMessageItemEnumModel
})

const GroupThreadViewModel = types.model('GroupThreadViewModel', {
  currentChat: typeReference(ChatModel),
  messageItemIdTypeMapModel: types.map(MessageItemIdTypeMapModel),
})

export default GroupThreadViewModel