import { Instance, types } from 'mobx-state-tree';
import React from 'react';
import { combineModel } from './helpers/combineModel';

export const S1Model = types.model({
  s1P1: types.string,
  s1P2: types.model({
    name: types.string,
    value: types.string
  })
}).actions((self) => ({
  changeP1(val: string) {
    self.s1P1 = val
  }
}))

function S1Comp({ vmInstance, children }: {
  vmInstance: Instance<typeof S1Model>,
  children?: React.ReactNode;
}) {

  return (
    <div style={{margin: '40px'}}>
      <h3>component S1</h3>
      <div>p1: { vmInstance.s1P1 }</div>
      <div>p2: { vmInstance.s1P2.name} , { vmInstance.s1P2.value }</div>
      <button onClick={() => vmInstance.changeP1(vmInstance.s1P1 + 1)}>change p1</button>
      {children}
    </div>
  )
}

const S1View = combineModel(S1Comp, S1Model);

export default S1View