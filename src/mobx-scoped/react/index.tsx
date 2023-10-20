import * as React from 'react';
import type { Store } from '../vanilla';
import { createStore, getGlobalStore } from '../vanilla';
// import type { SnapshotIn } from 'mobx-state-tree';
import type { IAnyComplexType } from 'mobx-state-tree';
// import { isTypeWithIdentifier } from '../vanilla/node-utils';

const StoreContext = React.createContext<Store | null>(null);

export const StoreProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [store] = React.useState(() => createStore());
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  return React.useContext(StoreContext) ?? getGlobalStore();
};

// export const useInstance = <IT extends IAnyComplexType>(
//   type: IT,
//   options: {
//     identifier?: string;
//     defaultSnapshot?: SnapshotIn<IT> | (() => SnapshotIn<IT>);
//   } = {},
// ) => {
//   const store = useStore();
//   const isFirstCreation = React.useRef(false);
//   const [defaultSnapshot] = React.useState(options.defaultSnapshot);
//   const identifier = (() => {
//     if (!isTypeWithIdentifier(type)) {
//       return undefined;
//     }
//     if (defaultSnapshot) {
//       return defaultSnapshot[type.identifierAttribute] as string;
//     }
//     if (options.identifier) {
//       return options.identifier;
//     }
//   })();
//   // 1. Get instance
//   let instance = store.get(type, identifier);
//   if (instance) {
//     if (!isFirstCreation.current && defaultSnapshot) {
//       // TODO warning about this is not the first creation
//     }
//     return instance;
//   }
//   if (!defaultSnapshot) {
//     throw new Error(
//       `The instance of ${type.name} is not found in the mobx scope, you should use 'useInstance(${type.name}, { defaultSnapshot: () => ... })' at lease once to add a instance to the mobx scope.`,
//     );
//   }
//   instance = type.create(defaultSnapshot, store) as Instance<IT>;
//   store.set(instance);
//   isFirstCreation.current = true;
//   return instance;
// };

export const useInstance = <IT extends IAnyComplexType>(
  type: IT,
  identifier?: string,
) => {
  const store = useStore();
  const instance = store.get(type, identifier);
  if (!instance) {
    throw new Error(
      `The instance of ${type.name} is not found in the mobx scope, you should use 'store.createInstance(${type.name}, { ... })' to add a instance to the mobx scope.`,
    );
  }
  return instance;
};
