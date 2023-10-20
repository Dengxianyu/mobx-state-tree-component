import * as React from 'react';
import { Instance } from 'mobx-state-tree';
import ImgMsgViewModel from './ViewModel';
import { observer } from 'mobx-react-lite';

const ImgMsgView = observer((props: { vmInstance: Instance<typeof ImgMsgViewModel>}) => {
  return (
    <div>
      <h2>这是一条图片消息</h2>
      <img 
        alt='' 
        src={ props.vmInstance.imgMsgModel.url.previewUrl }
        width={props.vmInstance.maxWidth}
        onClick={props.vmInstance.onImgClick}
      />
      <strong>（点击图片，这里看出两个场景的差异性）</strong>
    </div>
  )
})

ImgMsgView.displayName = 'ImgMsgView'

export default ImgMsgView