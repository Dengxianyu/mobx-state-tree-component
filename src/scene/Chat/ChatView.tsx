import { useVMInstanceGetter } from '../../mst-enhance';
import MsgItemView from '../../view-components/MsgItem';
import ChatViewModel from './ViewModel';
import { Instance } from 'mobx-state-tree';

const ChatView = (props: { vmInstance: Instance<typeof ChatViewModel>}) => {
  const getMsgItemVMInstance = useVMInstanceGetter(MsgItemView);
  return (
    <div>
      { [...props.vmInstance.messageItemIdTypeMapModel.keys()].map((msgId) => {
        const msgItemVMInstance = getMsgItemVMInstance(props.vmInstance, msgId);
        return (
          <MsgItemView vmInstance={msgItemVMInstance} key={msgId} />
        )
      }) }
    </div>
  )
}

export default ChatView