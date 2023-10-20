import { Store, StoreProvider, useStore } from '../../mobx-scoped';
import { SnapshotIn } from 'mobx-state-tree';
import { AuthInfo, ChatInfo, GetGroupThreadMessagesResponse } from '../../mock/response';
import { SetRequiredExcludeKeys } from '../../types/helper';
import { AppInfoModel } from '../../biz-models/singleton/AppInfo';
import { VMInstanceGetterProvider } from '../../mst-enhance';
import instanceGetterMap from './instanceGetterMap';
import GroupThreadView from './GroupThreadView';
import { ChatModel } from '../../biz-models/multiton/Chat';
import { ChatterModel } from '../../biz-models/multiton/Chatter';
import { MessageEntityModel } from '../../biz-models/multiton/MessageEntity';
import GroupThreadViewModel from './ViewModel';
import { ImgMsgModel, TextMsgModel } from '../../biz-models/multiton/MessageType';


interface GroupThreadProps {
  GroupThreadMessagesResp: GetGroupThreadMessagesResponse;
  authInfo: AuthInfo,
  currentChatInfo: ChatInfo
}

const fillBizInstance2Store = (props: GroupThreadProps, store: Store) => {
  // 这里做了一些数据上不兼容的转换。
  // 由于 pb 结构大量 optional 但是实际是有值的，所以将它深度遍历转换成required后再计算以免 ts 报错
  // 虽然 ts 这样检测失效了，但是 mst 在运行时会帮我们再检测一次是否传值不匹配
  const propsAsRequiredAllAttrs = props as SetRequiredExcludeKeys<GroupThreadProps, never>;
  const { authInfo, currentChatInfo, GroupThreadMessagesResp: { entity: { chats, chatters, messages } } } = propsAsRequiredAllAttrs;
  store.createInstance(AppInfoModel, { authInfo, userSetting: {} });
  store.createInstance(ChatModel, currentChatInfo);
  if (chats) {
    Object.values(chats).forEach(chat => {
      store.createOrUpdate(ChatModel, chat);
    });
  }
  if (chatters) {
    Object.values(chatters).forEach(chatter => {
      store.createOrUpdate(ChatterModel, chatter);
    });
  }
  if (messages) {
    Object.values(messages).forEach(message => {
      if (message.type === 4) {
        store.createOrUpdate(TextMsgModel, {
          id: message.id,
          text: message.content.text,
          atUsers: message.content.atUsers.reduce<Record<string, string>>((record, userId) => {
            record[userId] = userId;
            return record;
          }, {})
        });
        const messagesSnapShot: SnapshotIn<typeof MessageEntityModel> = {
          id: message.id,
          sender: message.senderId,
          content: {
            type: 4,
            value: message.id
          }
        };
        store.createOrUpdate(MessageEntityModel, messagesSnapShot);
      }

      if (message.type === 5) {
        store.createOrUpdate(ImgMsgModel, {
          id: message.id,
          url: message.content.url
        })
        const messagesSnapShot: SnapshotIn<typeof MessageEntityModel> = {
          id: message.id,
          sender: message.senderId,
          content: {
            type: 5,
            value: message.id
          }
        };
        store.createOrUpdate(MessageEntityModel, messagesSnapShot);
      }
    });
  }
}

function GroupThreadWithStore(props: GroupThreadProps) {

  const store = useStore();

  // 开启 destroyStore 就会出错，暂时先不管
  // useEffect(() => {
  //   return () => {
  //     store.destroyStore();
  //     console.log('store destroyed when UI will unmount')
  //   }
  // }, [store])

  fillBizInstance2Store(props, store);

  // messageItemIdTypeMapModel 属于只在 chat 场景下才有效的业务数据，所以定义在这个场景下面，并直接挂载到 GroupThreadViewModel 下
  const messageItemIdTypeMapModelSnapshot: SnapshotIn<typeof GroupThreadViewModel>['messageItemIdTypeMapModel'] = {};
  (props.GroupThreadMessagesResp.messageItems || []).forEach(messageItem => {
    messageItemIdTypeMapModelSnapshot[messageItem.itemId] = messageItem
  })
  const chatViewModel = store.createOrUpdate(GroupThreadViewModel, {
    currentChat: props.currentChatInfo.id,
    messageItemIdTypeMapModel: messageItemIdTypeMapModelSnapshot
  })

  return (
      <GroupThreadView vmInstance={chatViewModel}/>
  )
}

// 在对外暴露正常的 react 组件需要用 props 组装该组件下的所有数据
function GroupThread(props: GroupThreadProps) {
  // 加上 StoreProvider 和 VMInstanceGetterProvider
  return (
    <StoreProvider>
      <VMInstanceGetterProvider value={instanceGetterMap}>
        <GroupThreadWithStore { ...props } />
      </VMInstanceGetterProvider>
    </StoreProvider>
  )
}

export default GroupThread