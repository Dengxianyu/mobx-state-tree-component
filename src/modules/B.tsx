import { Instance, types } from 'mobx-state-tree';
import React from 'react';
import { combineModel } from './helpers/combineModel';

export const BModel = types.model({
  bP1: types.string,
  bP2: types.model({
    name: types.string,
    value: types.string
  })
}).actions((self) => ({
  changeP1(val: string) {
    self.bP1 = val
  }
}))

function BComp({ vmInstance, children }: {
  vmInstance: Instance<typeof BModel>,
  children?: React.ReactNode;
}) {

  return (
    <div style={{margin: '40px'}}>
      <h3>component B</h3>
      <div>p1: { vmInstance.bP1 }</div>
      <div>p2: { vmInstance.bP2.name} , { vmInstance.bP2.value }</div>
      <button onClick={() => vmInstance.changeP1(vmInstance.bP1 + 1)}>change p1</button>
      {children}
    </div>
  )
}

const BView = combineModel(BComp, BModel);

export default BView