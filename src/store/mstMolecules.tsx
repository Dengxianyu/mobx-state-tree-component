/**
 * @desc: 仿照 jotai-molecules(https://jotai.org/docs/integrations/molecules)写属于 MST 的 molecules
*/

import { IAnyModelType, IAnyType, IModelType, Instance } from "mobx-state-tree";
import { AnyObj } from "../types/helper";
import { createContext, useContext, useState } from "react";

const MstContext = createContext(new Map<IAnyModelType, Instance<IAnyModelType>>());

export const useScopeInstance = <ScopeModel extends IAnyModelType>(scopeModel: ScopeModel) => {
  const context = useContext(MstContext)
  console.log('context value changed')
  if (!context.has(scopeModel)) {
    throw new Error('find mst scope model failed, maybe you forget add MstScopeProvider outer current components')
  }
  return context.get(scopeModel) as Instance<ScopeModel>
}

export const MstScopeProvider = <ScopeModel extends IAnyModelType>(
  {children, scopeModel, value}: {
    children: React.ReactNode;
    scopeModel: ScopeModel,
    value: Parameters<ScopeModel['create']>[0]
  }
) => {
  const parentContext = useContext(MstContext)
  // 放在 useState 函数里让 newContextMap 的值只计算一次，从而让 Provider value 的值不会一直改变
  const [newContextMap] = useState(() => {
    const map = new Map(Array.from(parentContext.entries())) as Map<ScopeModel, Instance<ScopeModel>>;
    map.set(scopeModel, scopeModel.create(value));
    return map;
  })
  return <MstContext.Provider value={ newContextMap }>{ children }</MstContext.Provider>

  // const map = new Map(Array.from(parentContext.entries())) as Map<ScopeModel, Instance<ScopeModel>>;
  // map.set(scopeModel, scopeModel.create(value));
  // return <MstContext.Provider value={ map }>{ children }</MstContext.Provider>
}
