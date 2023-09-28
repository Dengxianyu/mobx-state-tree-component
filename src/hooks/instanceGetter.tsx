import { IAnyModelType, Instance, SnapshotIn } from "mobx-state-tree";
import { createContext, useContext, useState } from "react";

const InstanceGetterContext = createContext(new Map<IAnyModelType, any>());

export const useInstanceGetter = <ViewModel extends IAnyModelType>(viewModel: ViewModel) => {
  const getter = useContext(InstanceGetterContext).get(viewModel)
  
  return getter as ((props: SnapshotIn<ViewModel>) => {
    instance: Instance<ViewModel>, 
    MstScopeProvider: ({ children }: { children: React.ReactNode; }) => JSX.Element
  })  | undefined
}

export const InstanceGetterProvider = <ViewModel extends IAnyModelType>(
  {children, viewModel, value}: {
    children: React.ReactNode;
    viewModel: ViewModel,
    value: (props: SnapshotIn<ViewModel>) => {
      instance: Instance<ViewModel>, 
      MstScopeProvider: ({ children }: { children: React.ReactNode; }) => JSX.Element
    }
  }
) => {
  const parentContext = useContext(InstanceGetterContext)
  // 放在 useState 函数里让 newContextMap 的值只计算一次，从而让 Provider value 的值不会一直改变
  const [newContextMap] = useState(() => {
    const map = new Map(Array.from(parentContext.entries())) as Map<ViewModel, (props: SnapshotIn<ViewModel>) => {
      instance: Instance<ViewModel>, 
      MstScopeProvider: ({ children }: { children: React.ReactNode; }) => JSX.Element
    }>;
    map.set(viewModel, value);
    return map;
  })
  return <InstanceGetterContext.Provider value={ newContextMap }>{ children }</InstanceGetterContext.Provider>
}