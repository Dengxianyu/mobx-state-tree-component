import { types } from "mobx-state-tree";
import { BaseMessageModel } from "./basicMsg";

const PicContent = types.model()

const _PicMessageModel = types.model({
  type: types.literal(5),
  content: PicContent
  // ...
})

export const PicMessageModel = types.compose(BaseMessageModel, _PicMessageModel)