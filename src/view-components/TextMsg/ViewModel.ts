import { types, Instance } from "mobx-state-tree";
import { TextMsgModel } from "../../biz-models/multiton/MessageType";
import { typeReference } from "../../mobx-scoped"
import { ChatterModel } from "../../biz-models/multiton/Chatter"

const UrlPreviewModel = types.model('UrlPreview', {
  enable: true,
  // 展示的位置是在文本内部还是在文本区域的
  position: types.optional(types.union(types.literal('inner'), types.literal('bottom')), 'bottom')
})

const TextMsgViewModel = types.model('TextMsgViewModel', {
  id: types.identifier,
  textMsgModel: typeReference(TextMsgModel),
  // 是否降级展示
  showDemoted: false,
  urlPreview: types.optional(UrlPreviewModel, {}),
  limitMaxHeight: 100,
}).actions((self) => ({
  onAtUserClick(userModel: Instance<typeof ChatterModel>) {
    console.log(`${userModel.name} clicked`)
  }
}))



export default TextMsgViewModel