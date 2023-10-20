import { applySnapshot, getEnv, isModelType, types } from 'mobx-state-tree';
import type {
  IAnyComplexType,
  IAnyStateTreeNode,
  IModelType,
  Instance,
  SnapshotIn,
} from 'mobx-state-tree';
import {
  isStateTreeNode,
  type AnyObject,
  isTypeWithIdentifier,
} from './node-utils';

/**
 * instance family 快速 id 索引实例族中实例
 */
export const typeFamily = <M extends IModelType<AnyObject, AnyObject>>(
  model: M,
) => {
  return types
    .model({
      instanceMap: types.map(model),
    })
    .actions((self) => ({
      set(instance: Instance<M>) {
        if (!isStateTreeNode<M>(instance)) {
          return;
        }
        const treeNode = instance.$treenode;
        if (!treeNode.identifier) {
          return;
        }
        self.instanceMap.set(String(treeNode.identifier), instance);
      },
      delete(identifier: string) {
        self.instanceMap.delete(identifier);
      },
    }))
    .views((self) => ({
      get(identifier: string) {
        return self.instanceMap.get(identifier);
      },
    }));
};

type InstanceCache = WeakMap<IAnyComplexType, Instance<IAnyComplexType>>;

type InstanceFamilyCache = WeakMap<
  IModelType<AnyObject, AnyObject>,
  Instance<ReturnType<typeof typeFamily>>
>;

const resolveIdentifier = <M extends IAnyComplexType>(
  store: {
    instanceCache: InstanceCache;
    instanceFamilyCache: InstanceFamilyCache;
  },
  model: M,
  identifier: string | number,
) => {
  const { instanceFamilyCache, instanceCache } = store;
  if (isModelType(model) && isTypeWithIdentifier(model)) {
    return instanceFamilyCache.get(model)?.get(String(identifier)) as
      | Instance<M>
      | undefined;
  }
  return instanceCache.get(model) as Instance<M> | undefined;
};

/**
 * 创建一个 store，与 jotai store 定位差不多，作为 instance 的承载地
 */
export const createStore = () => {
  const instanceCache: InstanceCache = new WeakMap();
  const instanceFamilyCache: InstanceFamilyCache = new WeakMap();

  const set = <IT extends IAnyComplexType>(instance: Instance<IT>) => {
    if (!isStateTreeNode<IT>(instance)) {
      return;
    }
    const treeNode = instance.$treenode;
    // console.log("set: instance", instance);
    const model = treeNode.type;
    // console.log('set: model', model);
    if (isModelType(model) && isTypeWithIdentifier(model)) {
      let family = instanceFamilyCache.get(model);
      if (!family) {
        family = typeFamily(model).create({}, store);
        // family = new Map();
        instanceFamilyCache.set(model, family);
      }
      family.set(instance);
      // family.set(instance.$treenode.identifier, instance);
      // console.log("set: family", family);
      return;
    }
    instanceCache.set(model, instance);
  };

  const get = <IT extends IAnyComplexType>(type: IT, identifier?: string) => {
    if (isTypeWithIdentifier(type) && !identifier) {
      throw new Error(
        `Model '${type.name}' is with identifier, but the 'identifier' parameter is not assigned.`,
      );
    }
    if (!isTypeWithIdentifier(type) && !identifier) {
      return instanceCache.get(type) as Instance<IT>;
    }
    if (isTypeWithIdentifier(type) && identifier) {
      return resolveIdentifier(
        { instanceCache, instanceFamilyCache },
        type,
        identifier,
      );
    }
  };

  const remove = <IT extends IAnyComplexType>(
    type: IT,
    identifier?: string,
  ) => {
    if (isTypeWithIdentifier(type) && !identifier) {
      throw new Error(
        `Model '${type.name}' is with identifier, but the 'identifier' parameter is not assigned.`,
      );
    }
    if (!isTypeWithIdentifier(type) && !identifier) {
      instanceCache.delete(type);
    }
    if (isModelType(type) && isTypeWithIdentifier(type) && identifier) {
      instanceFamilyCache.get(type)?.delete(identifier);
    }
  };

  const createInstance = <IT extends IAnyComplexType>(
    type: IT,
    snapshot: SnapshotIn<IT>,
  ): Instance<IT> => {
    const instance = type.create(snapshot, store);
    set(instance as Instance<IT>);
    return instance as Instance<IT>;
  };

  const createOrUpdate = <IT extends IAnyComplexType>(
    type: IT,
    snapshot: SnapshotIn<IT>,
  ): Instance<IT> => {
    const identifierAttribute = type.identifierAttribute;
    const identifier = identifierAttribute && snapshot[identifierAttribute]
    if (identifierAttribute && !identifier) {
      throw new Error(
        `Model '${type.name}' is with identifier, but the 'identifier' parameter is not assigned.`,
      );
    }
    const instanceInStore = get(type, identifier);

    if (instanceInStore) {
      console.time(`${type.name} instance applySnapshot cost`)
      applySnapshot(instanceInStore, snapshot);
      console.timeEnd(`${type.name} instance applySnapshot cost`)
      return instanceInStore
    }

    return createInstance(type, snapshot)
  };

  const removeInstance = <IT extends IAnyComplexType>(
    type: IT,
    identifier?: string,
  ) => {
    remove(type, identifier);
  };

  const store = {
    get,
    instanceCache,
    instanceFamilyCache,
    createInstance,
    removeInstance,
    // 希望如果 instance 存在就不创建而是以 snapShot 去更新
    createOrUpdate,
    // 希望能强制销毁
    destroyStore() {
      this.instanceCache = new WeakMap();
      this.instanceFamilyCache = new WeakMap();
    }
  };

  return store;
};

let _globalStore: Store | null = null;
export const getGlobalStore = () => {
  console.log("🚀 ~ file: index.ts:197 ~ getGlobalStore ~ _globalStore:")
  if (!_globalStore) {
    _globalStore = createStore();
  }
  return _globalStore;
};

/**
 * @private
 */
export const __don_not_use_for_test_only_resetGlobalStore__ = () => {
  _globalStore = null;
};

export const typeReference = <IT extends IModelType<AnyObject, AnyObject>>(
  subType: IT,
) =>
  types.reference(subType, {
    get(identifier, parent) {
      const store = getEnv(parent);
      const resolved = resolveIdentifier(store, subType, identifier);
      if (!resolved) {
        throw new Error(`${subType.name}/${identifier} cannot be resolved.`);
      }
      // console.log("typeReference get", identifier, resolved);
      // console.log(parent?.toJS());
      return resolved;
    },
    set(value) {
      // console.log('typeReference set', value, parent);
      if (!isStateTreeNode(value)) {
        return '';
      }
      const { identifier } = value.$treenode;
      if (identifier) {
        const store = getEnv(value);
        const resolved = resolveIdentifier(store, subType, identifier);
        if (resolved) {
          return identifier;
        }
      }
      return '';
    },
  });

export type Store = ReturnType<typeof createStore>;

export const getScope = (target: IAnyStateTreeNode) => getEnv<Store>(target);
