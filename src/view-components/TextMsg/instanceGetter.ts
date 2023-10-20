/**
 * @desc: 将 TextMsgView 的所有 ViewModel instance getter 函数都从此处导出，方便提取公共函数复用以及管理
*/
import { Instance } from "mobx-state-tree";
import MsgItemViewModel from "../MsgItem/ViewModel";
import TextMsgViewModel from "./ViewModel";
import { ChatterModel } from "../../biz-models/multiton/Chatter";
import { getScope } from "../../mobx-scoped";

const openUserProfile = (userModel: Instance<typeof ChatterModel>) => {
  alert('open user profile')
}

// 这块不知道怎么命名好，但是觉得直接使用 1、2、3、4 这种数字也没什么不妥，反而是命名上关联场景看起来问题更大
export const getTextMsgVMInstance1 = (parentVMInstance: Instance<typeof MsgItemViewModel>) => {
  const store = getScope(parentVMInstance);
  const { content: { type, value } } = parentVMInstance.messageEntityModel
  if (type !== 4) {
    throw new Error('unexpected')
  }

  const textMsgVMExtended = TextMsgViewModel.extend((self) => ({
    actions: {
      onAtUserClick: openUserProfile
    }
  }));

  const textMsgVMInstance = store.createInstance(textMsgVMExtended, {
    id: value.id,
    textMsgModel: value.id,
    limitMaxHeight: 150,
  });

  return textMsgVMInstance
}

export const getTextMsgVMInstance2 = (parentVMInstance: Instance<typeof MsgItemViewModel>) => {
  const store = getScope(parentVMInstance);
  const { content: { type, value } } = parentVMInstance.messageEntityModel
  if (type !== 4) {
    throw new Error('unexpected')
  }

  const textMsgVMExtended = TextMsgViewModel.extend((self) => ({
    actions: {
      onAtUserClick: () => {
        console.log('do nothing')
      }
    }
  }));

  const textMsgVMInstance = store.createInstance(textMsgVMExtended, {
    id: value.id,
    textMsgModel: value.id,
    limitMaxHeight: 200,
    urlPreview: { enable: false }
  });

  return textMsgVMInstance
}