import { Instance } from 'mobx-state-tree';
import * as React from 'react';
import MsgItemViewModel from './ViewModel';
import { useUnmountRmVMInstance, useVMInstanceGetter } from '../../mst-enhance';
import TextMsgView from '../TextMsg';
import { observer } from 'mobx-react-lite';
import ImgMsgView from '../ImgMsg';

const MsgItemView = observer((props: { vmInstance: Instance<typeof MsgItemViewModel>}) => {
  const { messageEntityModel: { hasFlag, hasPin, content }  } = props.vmInstance;
  
  const getTextMsgVMInstance = useVMInstanceGetter(TextMsgView)
  const getImgMsgVMInstance = useVMInstanceGetter(ImgMsgView)

  let itemContent: React.ReactNode = '<div>unexpected message type</div>';

  if (content.type === 4) {
    const textMsgVMInstance = getTextMsgVMInstance(props.vmInstance)
    itemContent = <TextMsgView vmInstance={textMsgVMInstance} />
  }

  if (content.type === 5) {
    const imgMsgVMInstance = getImgMsgVMInstance(props.vmInstance)
    itemContent = <ImgMsgView vmInstance={imgMsgVMInstance} />
  }

  useUnmountRmVMInstance(MsgItemViewModel, props.vmInstance.id)

  return (
    <div style={{background: props.vmInstance.backgroundColor, padding: '20px', margin: '20px'}}>
      { itemContent }
      <p>hasFlag: {`${hasFlag}`}</p>
      <p>hasPin: {`${hasPin}`}</p>
    </div>
  )
})

export default MsgItemView