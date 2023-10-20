import { types } from "mobx-state-tree"
import { ImgMsgModel } from "../../biz-models/multiton/MessageType"
import { typeReference } from "../../mobx-scoped"

const ImgMsgViewModel = types.model('ImgMsgViewModel', {
  id: types.identifier,
  maxWidth: types.string,
  imgMsgModel: typeReference(ImgMsgModel)
})
.actions((self) => ({
  onImgClick() {
    // 待实现
  }
}))

export default ImgMsgViewModel