import { Instance, types } from 'mobx-state-tree';
import React from 'react';
import { combineModel } from './helpers/combineModel';

const S3Model = types.model({
  s3P1: types.string,
  s3P2: types.model({
    name: types.string,
    value: types.string
  })
}).actions((self) => ({
  changeP1(val: string) {
    self.s3P1 = val
  }
}))

function S3Comp({ vmInstance, children }: {
  vmInstance: Instance<typeof S3Model>
  children?: React.ReactNode;
}) {

  return (
    <div style={{margin: '40px'}}>
      <h3>component S3</h3>
      <div>p1: { vmInstance.s3P1 }</div>
      <div>p2: { vmInstance.s3P2.name} , { vmInstance.s3P2.value }</div>
      <button onClick={() => vmInstance.changeP1(vmInstance.s3P1 + 1)}>change p1</button>
      {children}
    </div>
  )
}

const S3View = combineModel(S3Comp, S3Model);

export default S3View