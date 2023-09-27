// import { types, SnapshotIn } from "mobx-state-tree"
// import { useMSTInstance, useScopeInstance } from "./store/mstEnhance";

// const ListItemModel = types.model({id: types.string, name: types.string});

// const SonComModel = types.model({
//   list: types.array(ListItemModel)
// })

// const SonCom = () => {
//   const selfVMInstance = useScopeInstance(SonComModel);
//   return (
//     <div>{selfVMInstance.list.length}</div>
//   )
// }

// const Demo4 = (props: { messageList: SnapshotIn<typeof ListItemModel>}[]) => {
//   const [_, ] = useMSTInstance(SonComModel, { list: messageList })
// }