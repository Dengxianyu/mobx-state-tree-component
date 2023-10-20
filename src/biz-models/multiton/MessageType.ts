import { types } from "mobx-state-tree";
import { typeReference } from "../../mobx-scoped";
import { ChatterModel } from "./Chatter";


export const TextMsgModel = types.model('TextMsgModel', {
  id: types.identifier,
  text: types.string,
  atUsers: types.map(typeReference(ChatterModel)),
})

export const ImgMsgModel = types.model('ImgMsgModel', {
  id: types.identifier,
  url: types.model({
    previewUrl: '',
    normalSizeUrl: '',
    originSizeUrl: '',
  })
})

const TextMsgModelWithType = types.model({
  type: types.literal(4),
  value: typeReference(TextMsgModel)
})

const ImgMsgModelWithType = types.model({
  type: types.literal(5),
  value: typeReference(ImgMsgModel)
})

// 将后端数据类型转换成联合类型，在前端应该转换为更好地让 ts narrow
export const unionMsgContent = types.union(TextMsgModelWithType, ImgMsgModelWithType)