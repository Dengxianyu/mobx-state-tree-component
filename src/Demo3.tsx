import React, { useEffect, useState } from 'react';
import { MstScopeProvider, useScopeInstance } from './store/mstMolecules';
import { MessageListModel } from './store/multiton/messgaList';
import { observer } from 'mobx-react-lite';
import multitonManager from './store/multitonManager';

const View = observer(function() {
  const messageListInstance = multitonManager.useScopeModelInstance(MessageListModel)
  return (
    <div onClick={() => {messageListInstance.addFocusMsgId()}}>
      { messageListInstance.focusMsg.id }
    </div>
  )
})

const createMockData = () => Array(10).fill(1).map((v, i) => ({
  id: `${i}`,
  type: 5 as const,
  version: '11sdd',
  content: {}
}))

function Demo2() {
  const [mockListData, setMockListData] = useState(createMockData());
  
  useEffect(()=> {
    setTimeout(setMockListData, 5 * 1000, createMockData)
  }, [])

  const MstScopeProvider1 = multitonManager.addMultitonModel(
    MessageListModel,
    { listData: mockListData, focusMsg: '1'}
  )

  const MstScopeProvider2 = multitonManager.addMultitonModel(
    MessageListModel,
    { listData: mockListData, focusMsg: '1'}
  )

  const MstScopeProvider3 = multitonManager.addMultitonModel(
    MessageListModel,
    { listData: mockListData, focusMsg: '1'}
  )

  return <div>
    <h1>With initial value 1</h1>
    <MstScopeProvider1>
      <View />
      <View />
    </MstScopeProvider1>
    <h1>With initial value 2</h1>
    <MstScopeProvider2>
      <View />
      <h2>With initial value 3</h2>
      <MstScopeProvider3>
        <View />
      </MstScopeProvider3>
    </MstScopeProvider2>
  </div>
}

export default observer(Demo2)