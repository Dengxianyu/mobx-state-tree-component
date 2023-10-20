import { GetChatMessagesResponseMessageItemItemType, GetGroupThreadMessagesResponseMessageItemItemType } from "../mock/response";
import { createEnumPrimitive } from "../mst-enhance";

export const ChatMessageItemEnumModel = createEnumPrimitive(GetChatMessagesResponseMessageItemItemType, 'ChatMessageItemEnumModel')

export const MessageTypeEnumModel = createEnumPrimitive(GetChatMessagesResponseMessageItemItemType, 'MessageTypeEnumModel')

export const GroupThreadMessageItemEnumModel = createEnumPrimitive(GetGroupThreadMessagesResponseMessageItemItemType, 'GetGroupThreadMessagesResponseMessageItemItemType')
