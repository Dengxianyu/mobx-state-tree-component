import { getIdentifier, types } from "mobx-state-tree";
import { BaseMessageModel } from "./basicMsg";




const TextContent = types.model({
  atChatterIds: types.array(types.string)
}).views((self) => ({
  // filterOuterAtChatters() {
  //   self.atChatterIds.map()
  // }
}))

const _TextMessageModel = types.model({
  type: types.literal(4),
  content: TextContent
  // ...
})

export const TextMessageModel = types.compose(BaseMessageModel, _TextMessageModel)