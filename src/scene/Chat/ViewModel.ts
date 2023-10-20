import { types } from "mobx-state-tree"
import { ChatMessageItemEnumModel } from "../../biz-models/enum"
import { ChatModel } from "../../biz-models/multiton/Chat"
import { typeReference } from "../../mobx-scoped"

export const MessageItemIdTypeMapModel = types.model('MessageItemIdTypeMapModel', {
  itemId: types.identifier,
  itemType: ChatMessageItemEnumModel
})

const ChatViewModel = types.model('ChatViewModel', {
  currentChat: typeReference(ChatModel),
  messageItemIdTypeMapModel: types.map(MessageItemIdTypeMapModel),
})

export default ChatViewModel