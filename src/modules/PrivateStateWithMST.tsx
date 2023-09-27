/**
 * @desc: 这是一个示例想演示如何与 private state 更好的使用
 */
import React, { useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import appStatesModel from '../store/singleton/appStates';
import { Theme } from '../store/enumPrimitives';

const PrivateStateWithMST = observer(() => {
  console.log("🚀 ~ file: PrivateStateWithMST.tsx re-render:")

  // 方式 1: 仍使用 useState
  // const [privateState, setPrivateState] = useState({ a: 1, b: 2 }); 

  // return <div onClick={() => {
  //   setPrivateState({ ...privateState, a: privateState.a + 1 })
  // }}>{privateState.b}</div>

  // 方式 2: 使用 useLocalObservable 来封装下，它的好处是可以利用 observer 能力减少 re-render
  const privateModel = useLocalObservable(() => ({
    privateState: { a: 1, b: 2 },
    resetAction() {
      privateModel.privateState.a++;
    }
  }));

  return <div onClick={() => { privateModel.resetAction(); }}>
    {privateModel.privateState.b}
  </div>
})

export default PrivateStateWithMST