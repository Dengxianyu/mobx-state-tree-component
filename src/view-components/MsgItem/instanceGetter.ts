/**
 * @desc: 将 MsgItemView 的所有 ViewModel instance getter 函数都从此处导出，方便提取公共函数复用以及管理
*/
import { Instance } from "mobx-state-tree";
import MsgItemViewModel from "./ViewModel";
import { ChatterModel } from "../../biz-models/multiton/Chatter";
import { getScope } from "../../mobx-scoped";
import ChatViewModel from "../../scene/Chat/ViewModel";

const openUserProfile = (userModel: Instance<typeof ChatterModel>) => {
  alert('open user profile')
}

// 这块不知道怎么命名好，但是觉得直接使用 1、2、3、4 这种数字也没什么不妥，反而是命名上关联场景看起来问题更大
export const getMsgItemVMInstance1 = (chatViewModel: Instance<typeof ChatViewModel>, msgId: string) => {
  const store = getScope(chatViewModel);

  const { itemType } = chatViewModel.messageItemIdTypeMapModel.get(msgId)!;
  if (itemType === 2) {
    console.log('quasi message')
  }

  const msgItemVMExtended = MsgItemViewModel.extend((self) => ({
    actions: {
      onItemClick: openUserProfile
    }
  }));

  const msgItemVMInstance = store.createInstance(msgItemVMExtended, {
    id: msgId,
    backgroundColor: itemType === 2 ? 'lightgray' : 'lightgoldenrodyellow',
    messageEntityModel: msgId
  });

  return msgItemVMInstance
}

export const getMsgItemVMInstance2 = (chatViewModel: Instance<typeof ChatViewModel>, msgId: string) => {
  const store = getScope(chatViewModel);

  const { itemType } = chatViewModel.messageItemIdTypeMapModel.get(msgId)!;
  if (itemType === 2) {
    console.log('quasi message')
  }

  const msgItemVMExtended = MsgItemViewModel.extend((self) => ({
    actions: {
      onItemClick: () => {
        console.log('do nothing')
      }
    }
  }));

  const msgItemVMInstance = store.createInstance(msgItemVMExtended, {
    id: msgId,
    backgroundColor: itemType === 2 ? 'lightgray' : 'lightgoldenrodyellow',
    messageEntityModel: msgId
  });

  return msgItemVMInstance
}