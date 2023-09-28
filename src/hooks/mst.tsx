import { IAnyComplexType, IAnyModelType, IAnyType, Instance, getType, types } from "mobx-state-tree"
import { AnyObj, Expand, ValueOf } from "../types/helper"
import React, { createContext, useContext, useState } from "react"
import { useLocalObservable } from "mobx-react-lite"
import { nanoid } from "nanoid"

const MstContext = createContext(new Map<IAnyModelType, Instance<IAnyModelType>>());

export const useScopeInstance = <ScopeModel extends IAnyModelType>(scopeModel: ScopeModel) => {
  const context = useContext(MstContext)
  console.log('context value changed')
  if (!context.has(scopeModel)) {
    throw new Error('find mst scope model failed, maybe you forget add MstScopeProvider outer current components')
  }
  return context.get(scopeModel) as Instance<ScopeModel>
}

/**
 * @desc 二次封装 Model 本来的 create 方法，会额外将 model Instance 挂载到一个 rootModel 中。
 * - 原因是业务中想以原子的形式使用 MST，但是 MST 的 reference 功能需要实例是定义在一个 Model 下
 * - 而业务上不想维护一个 rootModel，所以替换 Model.create 方法使用此方法挂载一个 rootModel
 */
export const useMSTInstance = (() => {
  const RootModel = types.model({
    rootState: types.map(types.model({
      id: types.identifier,
      instance: types.frozen()
    }))
  }).actions((self) => ({
    addState(instance: IAnyType, id: string) {
      self.rootState.put({ id, instance })
    }
  }))
  const rootModel = RootModel.create();

  type ScopeProviderType = React.FC<{ children: React.ReactNode; }>;
  const singletonModelAndProviderMap = new WeakMap<IAnyModelType, ScopeProviderType>()
  const singletonModelAndInstanceMap = new WeakMap<IAnyModelType, IAnyType>()

  return <ModelType extends IAnyModelType>(
    model: ModelType, 
    value: Parameters<ModelType['create']>[0], 
    { 
      isSingleton = false
    }: {
      isSingleton: boolean,
    } = {
      isSingleton: false
    }
  ): [Instance<ModelType>, ScopeProviderType] => {
    const providerFromMap = singletonModelAndProviderMap.get(model);
    const instanceFromMap = singletonModelAndInstanceMap.get(model);
    if (isSingleton && instanceFromMap && providerFromMap) {
      return [instanceFromMap as Instance<ModelType>, providerFromMap]
    }

    const instance = model.create(value);
    const uniqId = nanoid();
    rootModel.addState(instance, uniqId);

    const MstScopeProvider = (
      {children}: {
        children: React.ReactNode;
      }
    ) => {
      const parentContext = useContext(MstContext)
      // 放在 useState 函数里让 newContextMap 的值只计算一次，从而让 Provider value 的值不会一直改变
      const [newContextMap] = useState(() => {
        const map = new Map(Array.from(parentContext.entries())) as Map<ModelType, Instance<ModelType>>;
        map.set(model, instance);
        return map;
      })
      return <MstContext.Provider value={ newContextMap }>{ children }</MstContext.Provider>
    }

    if (isSingleton) {
      singletonModelAndProviderMap.set(model, MstScopeProvider)
      singletonModelAndInstanceMap.set(model, instance)
    }

    return [instance, MstScopeProvider]
  }
})()