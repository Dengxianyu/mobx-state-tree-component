/**
 * @desc: 将 TextMsgView 的所有 ViewModel instance getter 函数都从此处导出，方便提取公共函数复用以及管理
*/
import { Instance } from "mobx-state-tree";
import MsgItemViewModel from "../MsgItem/ViewModel";
import ImgMsgViewModel from "./ViewModel";
import { getScope } from "../../mobx-scoped";
import GroupThreadViewModel from "../../scene/GroupThread/ViewModel";

const openUserProfile = () => {
  alert('打开图片查看器')
}

// 这块不知道怎么命名好，但是觉得直接使用 1、2、3、4 这种数字也没什么不妥，反而是命名上关联场景看起来问题更大
export const getImgMsgVMInstance1 = (parentVMInstance: Instance<typeof MsgItemViewModel>) => {
  const store = getScope(parentVMInstance);
  const { content: { type, value } } = parentVMInstance.messageEntityModel
  if (type !== 5) {
    throw new Error('unexpected')
  }

  const ImgMsgVMExtended = ImgMsgViewModel.extend((self) => ({
    actions: {
      onImgClick: openUserProfile
    }
  }));

  const ImgMsgVMInstance = store.createInstance(ImgMsgVMExtended, {
    id: value.id,
    maxWidth: '100px',
    imgMsgModel: value.id
  });

  return ImgMsgVMInstance
}

export const getImgMsgVMInstance2 = (parentVMInstance: Instance<typeof MsgItemViewModel>) => {
  const store = getScope(parentVMInstance);
  const { content: { type, value } } = parentVMInstance.messageEntityModel
  if (type !== 5) {
    throw new Error('unexpected')
  }

  const ImgMsgVMExtended = ImgMsgViewModel.extend((self) => ({
    actions: {
      onImgClick: () => {
        // 证明后续无论想实现什么功能，因为从 store 拿到的是全局的 ViewModel，所以什么逻辑都好写
        const groupThreadViewModel = store.get(GroupThreadViewModel);
        if (groupThreadViewModel?.messageItemIdTypeMapModel.get(value.id)?.itemType === 2) {
          alert('这是一条在 groupThread 场景下的图片假消息，所以暂时不打开图片查看器')
        } else {
          openUserProfile()
        }

      }
    }
  }));

  const ImgMsgVMInstance = store.createInstance(ImgMsgVMExtended, {
    id: value.id,
    maxWidth: '100px',
    imgMsgModel: value.id
  });

  return ImgMsgVMInstance
}