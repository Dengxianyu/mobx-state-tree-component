/**
 * @desc: mst 使用时可能有一些不方便的需要二次改造一下再在业务中使用
 */
import { IAnyComplexType, IAnyModelType, IAnyType, Instance, SnapshotIn, getType, isStateTreeNode, types } from "mobx-state-tree"
import { AnyObj, Expand, ValueOf } from "../types/helper"
import React, { createContext, useContext, useState } from "react"
import { useLocalObservable } from "mobx-react-lite"
import { nanoid } from "nanoid"

/**
 * @desc 为了让 number enum 能更好的和 mst 结合使用。经过本地简单测试它 1000 次调用体量在 3ms，所以对业务没影响
 * @param tsEnum 被转换的 ts enum
 * @param enumName 给它一个名称以在检测值不匹配时有一个更友好的提示
 * @returns 一个 mst 的自定义类型
 */
export function createEnumPrimitive<E extends AnyObj>(tsEnum: E, enumName: string) {
  return types.custom<ValueOf<E>, ValueOf<E>>({
    name: `ENUM_${enumName}`,
    fromSnapshot(value) {
        return value
    },
    toSnapshot(value) {
        return value
    },
    isTargetType(value): boolean {
        return typeof value === 'number'
    },
    getValidationMessage(value): string {
      if (Object.values(tsEnum).includes(value)) {
        return ''
      }
      return `${enumName} enum was set wrong value "${value}"`;
    }
  })
}

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
// export const createMSTInstance = (() => {
//   const RootModel = types.model({
//     rootState: types.map(types.model({
//       id: types.identifier,
//       instance: types.frozen()
//     }))
//   }).actions((self) => ({
//     addState(instance: IAnyType, id: string) {
//       self.rootState.put({ id, instance })
//     }
//   }))
//   const rootModel = RootModel.create();

//   type ScopeProviderType = React.FC<{ children: React.ReactNode; }>;
//   const singletonModelAndProviderMap = new WeakMap<IAnyModelType, ScopeProviderType>()
//   const singletonModelAndInstanceMap = new WeakMap<IAnyModelType, IAnyType>()

//   return <ModelType extends IAnyModelType>(
//     model: ModelType, 
//     value: SnapshotIn<ModelType>, 
//     { 
//       isSingleton = false
//     }: {
//       isSingleton: boolean,
//     } = {
//       isSingleton: false
//     }
//   ) => {
//     const providerFromMap = singletonModelAndProviderMap.get(model);
//     const instanceFromMap = singletonModelAndInstanceMap.get(model);
    
//     if (isSingleton && instanceFromMap && providerFromMap) {
//       return [instanceFromMap as Instance<ModelType>, providerFromMap]
//     }
    
//     // 兼容 instance 是在其父级 Model 下创建的，所以后续直接传 instance 给到子组件，这时候没必要再创建一个新的
//     const isMstInstance = isStateTreeNode(value);
//     let instance: Instance<ModelType>;
//     if(!isMstInstance) {
//       instance = model.create(value);
//       const uniqId = nanoid();
//       rootModel.addState(instance, uniqId);
//     } else {
//       instance = value
//     }

//     const MstScopeProvider = (
//       {children}: {
//         children: React.ReactNode;
//       }
//     ) => {
//       const parentContext = useContext(MstContext)
//       // 放在 useState 函数里让 newContextMap 的值只计算一次，从而让 Provider value 的值不会一直改变
//       const [newContextMap] = useState(() => {
//         const map = new Map(Array.from(parentContext.entries())) as Map<ModelType, Instance<ModelType>>;
//         map.set(model, instance);
//         return map;
//       })
//       return <MstContext.Provider value={ newContextMap }>{ children }</MstContext.Provider>
//     }

//     if (isSingleton) {
//       singletonModelAndProviderMap.set(model, MstScopeProvider)
//       singletonModelAndInstanceMap.set(model, instance)
//     }

//     return { instance, MstScopeProvider }
//   }
// })()

export const createMSTInstanceWithProvider = (() => {
  type ScopeProviderType = ({ children }: { children: React.ReactNode; }) => JSX.Element;
  const singletonModelAndProviderMap = new WeakMap<IAnyModelType, ScopeProviderType>()
  const singletonModelAndInstanceMap = new WeakMap<IAnyModelType, IAnyType>()

  return <ModelType extends IAnyModelType>(
    model: ModelType, 
    value: SnapshotIn<ModelType>, 
    { 
      isSingleton = false
    }: {
      isSingleton: boolean,
    } = {
      isSingleton: false
    }
  ) => {
    const providerFromMap = singletonModelAndProviderMap.get(model);
    const instanceFromMap = singletonModelAndInstanceMap.get(model);
    
    if (isSingleton && instanceFromMap && providerFromMap) {
      return { instance: instanceFromMap as Instance<ModelType>, MstScopeProvider: providerFromMap }
    }
    
    // 兼容 instance 是在其父级 Model 下创建的，所以后续直接传 instance 给到子组件，这时候没必要再创建一个新的
    const isMstInstance = isStateTreeNode(value);
    let instance: Instance<ModelType>;
    if(!isMstInstance) {
      instance = model.create(value);
    } else {
      instance = value
    }

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

    return { instance, MstScopeProvider }
  }
})()

