import { IAnyModelType, Instance, types } from "mobx-state-tree";
import React, { createContext, useContext } from "react";

const MstContext = createContext(new WeakMap<IAnyModelType, Instance<IAnyModelType>>());

const MultitonManager = types.model().actions(() => ({
  addMultitonModel<ScopeModel extends IAnyModelType>(
    scopeModel: ScopeModel,
    value: Parameters<ScopeModel['create']>[0]
  ) {
    const map = new WeakMap<ScopeModel, Instance<ScopeModel>>();
    map.set(scopeModel, scopeModel.create(value));
    return ({children }: {children: React.ReactNode;}) => {
      return <MstContext.Provider value={map}>{children }</MstContext.Provider>
    }
  }
})).views(() => ({
  useScopeModelInstance<ScopeModel extends IAnyModelType>(scopeModel: ScopeModel) {
    const context = useContext(MstContext)
    if (!context.has(scopeModel)) {
      throw new Error('find mst scope model failed, maybe you forget add MstScopeProvider outer current components')
    }
    return context.get(scopeModel) as Instance<ScopeModel>
  }
}))

const multitonManager = MultitonManager.create()

export default multitonManager