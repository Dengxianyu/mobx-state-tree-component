/**
 * @desc: mst 使用时可能有一些不方便的需要二次改造一下再在业务中使用
 */
import { IAnyModelType, IAnyStateTreeNode, types } from "mobx-state-tree";
import { AnyObj, ValueOf } from "../types/helper";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "../mobx-scoped";

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


export const VMInstanceGetterContext = createContext(new Map<React.FC<any>, IAnyModelType>());


/** 为了让组件和组件 ViewModel instance getter 函数之间有类型羁绊，没办法额外封装一个函数去实现 */
export const setVMInstanceGetter2Map = <
  InstanceType extends IAnyStateTreeNode, 
  ParentVMInstance extends IAnyStateTreeNode,
  V extends (p: ParentVMInstance, ...otherArgs: any[]) => InstanceType,
  K extends React.FC<{ vmInstance: ReturnType<V>}>,
>(
  map: Map<any, any>, key: K, value: V
) => {
  map.set(key, value)
}

export const VMInstanceGetterProvider = (props: { value: Map<any, any>, children: React.ReactNode}) => {
  const parentContext = useContext(VMInstanceGetterContext)
  // 放在 useState 函数里让 newContextMap 的值只计算一次，从而让 Provider value 的值不会一直改变
  const [newContextMap] = useState(() => {
    const map = new Map([...parentContext, ...props.value]);
    return map;
  })
  return <VMInstanceGetterContext.Provider value={ newContextMap }>{ props.children }</VMInstanceGetterContext.Provider>
}

export const useVMInstanceGetter = <InstanceType extends IAnyStateTreeNode, ParentVMInstance extends IAnyStateTreeNode>(
  ViewComp: React.FC<{ vmInstance: InstanceType}>
) => {
  const getVMInstance = useContext(VMInstanceGetterContext).get(ViewComp) as ((p: ParentVMInstance, ...others: unknown[]) => InstanceType) | undefined
  if (!getVMInstance) {
    throw new Error(`find ${ViewComp.name} instanceGetter function failed, maybe you forget add VMInstanceGetterContext outer current components`)
  }
  return getVMInstance
}


export const useUnmountRmVMInstance = (Model: IAnyModelType ,identifier?: string) => {
  const store = useStore();
  useEffect(() => {
    return () => {
      store.removeInstance(Model, identifier)
    }
  }, [Model, identifier, store])
}