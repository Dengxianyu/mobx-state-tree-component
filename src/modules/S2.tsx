import { Instance, SnapshotIn, types } from 'mobx-state-tree';
import React from 'react';
import { combineModel } from './helpers/combineModel';
import { InstanceGetterProvider } from '../hooks/instanceGetter';
import { AModel } from './A';
import { createMSTInstanceWithProvider, useScopeInstance } from '../store/mstEnhance';

const S2Model = types.model({
  s2P1: types.string,
  s2P2: types.model({
    name: types.string,
    value: types.string
  })
}).actions((self) => ({
  changeP1(val: string) {
    self.s2P1 = val
  }
}))

function S2Comp({ vmInstance, children }: {
  vmInstance: Instance<typeof S2Model>,
  children?: React.ReactNode;
}) {
  const aInstanceGetter = (props: SnapshotIn<typeof AModel>) => {
    return createMSTInstanceWithProvider(AModel, {
      aP1: vmInstance.s2P1 + props.aP1,
      aP2: { name: 'aP2', value: 'from S2'}
    })
  }
  return (
    <InstanceGetterProvider viewModel={AModel} value={aInstanceGetter}>
      <div style={{margin: '40px'}}>
        <h3>component S2</h3>
        <div>p1: { vmInstance.s2P1 }</div>
        <div>p2: { vmInstance.s2P2.name} , { vmInstance.s2P2.value }</div>
        <button onClick={() => vmInstance.changeP1(vmInstance.s2P1 + 1)}>change p1</button>
        { children }
      </div>
    </InstanceGetterProvider>
  )
}

const S2View = combineModel(S2Comp, S2Model);

export default S2View