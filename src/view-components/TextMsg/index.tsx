import * as React from 'react';
import { Instance } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import TextMsgViewModel from './ViewModel';

const TextMsgView = observer((props: { vmInstance: Instance<typeof TextMsgViewModel>}) => {
  return (
    <div>
      <h2>这是一条文本消息</h2>
      <p>是否降级展示：{`${props.vmInstance.showDemoted}`}</p>
      <p>urlPreview 配置：{JSON.stringify(props.vmInstance.urlPreview)}<strong>（这里看出两个场景的差异性）</strong></p>
      <p>@人：{[...props.vmInstance.textMsgModel.atUsers.values()].map(v => v.name).join('     ')}</p>
      <p>文本内容：{props.vmInstance.textMsgModel.text}</p>
    </div>
  )
})

export default TextMsgView;