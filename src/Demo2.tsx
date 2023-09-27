import React, { useEffect, useState } from 'react';
import { MstScopeProvider, useScopeInstance } from './store/mstMolecules';
import { MessageListModel, TestMultitonModel } from './store/multiton/messgaList';
import { observer } from 'mobx-react-lite';

const TestNoUseStoreComp = function() {
  console.log("🚀 ~ file: Demo2.tsx:8 ~ TestNoUseStoreComp ~ re-render:")
  return (
    <div>
      测试 Provider 改变是否会引发非必要组件的 re-render
    </div>
  )
}

const View = observer(function() {
  const testMultitonModel = useScopeInstance(TestMultitonModel)
  const messageListInstance = useScopeInstance(MessageListModel)
  return (
    <div onClick={(e) => {messageListInstance.addFocusMsgId(); e.stopPropagation()}}>
      { testMultitonModel.name } : { messageListInstance.focusMsg.id }
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

  const [_, refresh] = useState(0)

  return <div onClick={() => refresh(_ + 1)}>
    <MstScopeProvider scopeModel={TestMultitonModel} value={{ name: 'test'}}>
      <h1>With initial value 1</h1>
      <MstScopeProvider scopeModel={MessageListModel} value={{ listData: mockListData, focusMsg: '1'}}>
        <View />
        <View />
      </MstScopeProvider>
      <h1>With initial value 2</h1>
      <MstScopeProvider scopeModel={MessageListModel} value={{ listData: mockListData, focusMsg: '2'}}>
        <View />
        <h2>With initial value 3</h2>
        <MstScopeProvider scopeModel={MessageListModel} value={{ listData: mockListData, focusMsg: '3'}}>
          <View />
          <TestNoUseStoreComp />
        </MstScopeProvider>
      </MstScopeProvider>
    </MstScopeProvider>
  </div>
}

export default observer(Demo2)