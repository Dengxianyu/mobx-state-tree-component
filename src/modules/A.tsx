import { Instance, types } from 'mobx-state-tree';
import React from 'react';
import { combineModel } from './helpers/combineModel';

export const AModel = types.model({
  aP1: types.string,
  aP2: types.model({
    name: types.string,
    value: types.string
  })
}).actions((self) => ({
  changeP1(val: string) {
    self.aP1 = val
  }
}))

function AComp({ vmInstance, children }: {
  vmInstance: Instance<typeof AModel>,
  children?: React.ReactNode;
}) {

  return (
    <div style={{margin: '40px'}}>
      <h3>component A</h3>
      <div>p1: { vmInstance.aP1 }</div>
      <div>p2: { vmInstance.aP2.name} , { vmInstance.aP2.value }</div>
      <button onClick={() => vmInstance.changeP1(vmInstance.aP1 + 1)}>change p1</button>
      {children}
    </div>
  )
}

const AView = combineModel(AComp, AModel);

export default AView