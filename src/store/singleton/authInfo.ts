import { getMembers, getType, types, Instance, IModelType,  IAnyModelType, getSnapshot } from 'mobx-state-tree';
import { AnyObj } from '../../types/helper';

// from pb type
interface AuthInfo {
  userId: string;
  tenantId: string;
  /** @deprecated 不安全 */
  sessionId?: string;
  deviceId?: string;
  deviceLoginId?: string;
  upgradeEnabled?: boolean;
  isOversea?: boolean; // MG 下线
  isOverseaUser?: boolean; // MG 下线
  isChinaMainlandGeo: boolean; // 当前用户是否为‘CN GEO’
  isFeishuBrand: boolean; // 当前租户是否为飞书品牌
  userGeo: string; // 该用户的geo，'CN' | 'US' | 'SG' |'JP'| 'boe-va' | 'boe-cn';
  tenantGeo?: string; // 该用户的geo，'CN' | 'US' | 'SG' |'JP'| 'boe-va' | 'boe-cn';
  tenantBrand: "feishu" | "lark"; // 该租户的品牌
  serverUnit?: string;
  stayIn15Days?: boolean;
  userEnv?: string; // MG 下线
  /** @deprecated 不安全 */
  sessions?: { [sessingKey: string]: { name: string; value: string } };
  loginTime?: number;
  logoutToken?: string;
}

const sdkData: AuthInfo = {
  userId: '092374092374034823223',
  tenantId: '9877',
  isChinaMainlandGeo: true,
  isFeishuBrand: true,
  userGeo: 'CN',
  isOversea: false,
  tenantBrand: 'feishu'
}

const AuthInfoModel = types.model({
  userId: types.string,
  tenantId: types.string,
  isOversea: types.optional(types.boolean, false),
  tenantBrand: types.union(types.literal("feishu"), types.literal("lark")),
})

// 虽然 sdkData 数据远多于 AuthInfoModel 但是会帮裁剪
const authInfoModel = AuthInfoModel.create(sdkData);

export default authInfoModel



const ItemModel = types.model({
  id: types.identifier,
  name: types.string,
});

const RootStoreModel = types.model({
  items: types.array(ItemModel),
  selectedItem: types.reference(ItemModel)
}).actions(self => ({
  addItem(item: Instance<typeof ItemModel>) {
    // const a = self.selectedItem
    self.items.push(item);
  },
  setItem(id: string, name: string) {
    const res = self.items.find(({id: itemId}) => itemId === id);
    if (res) {
      res.name = name
    }
  }
}));

const rootStore = RootStoreModel.create({items: [{ id: '1', name: 'Item 1' }], selectedItem: '3'});

const item1 = ItemModel.create({ id: '1', name: 'Item 1' });
rootStore.addItem(item1);

console.log(rootStore.items.length); // 输出: 1

const item2 = ItemModel.create({ id: '3', name: 'Item 2' });
rootStore.addItem(item2);

rootStore.setItem('1', 'Item New')
console.log(getSnapshot(rootStore) ,rootStore.selectedItem, rootStore.items.length); // 输出: 2



const RootStoreModel2 = types.model({
  items: types.map(ItemModel),
  selectedItem: types.reference(ItemModel)
}).actions(self => ({
  addItem(item: Instance<typeof ItemModel>) {
    // const a = self.selectedItem
    // self.items.set('1', { id: '1', name: 'Item New', })
    self.items.put(item)
  },
  setItem(id: string, name: string) {
    self.items.set(id, { id, name})
  },
  filterItemByName(_name: string) {
    return [...self.items.values()].filter(({name}) => name === _name)
  },
  setSelected(id: string) {
    const item = self.items.get(id);
    if (item) {
      self.selectedItem = item
    }
  }
}));

const rootStore2 = RootStoreModel2.create({items: { 1: { id: '1', name: 'Item 1' } }, selectedItem: '3'});

rootStore2.addItem({ id: '3', name: 'Item 2' })

rootStore2.addItem({ id: '3', name: 'Item 3' })

console.log(getSnapshot(rootStore2) ,getSnapshot(rootStore2.selectedItem)); // 输出: 2

rootStore2.setSelected('1')

console.log(getSnapshot(rootStore2) ,getSnapshot(rootStore2.selectedItem), rootStore2.filterItemByName('Item 3')); // 输出: 2
