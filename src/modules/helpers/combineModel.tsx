import { IAnyModelType, SnapshotIn, Instance } from "mobx-state-tree"
import { useInstanceGetter } from "../../hooks/instanceGetter"
import { ComponentProps } from "react"
import { createMSTInstanceWithProvider } from "../../store/mstEnhance"
import { observer } from "mobx-react-lite"


export const combineModel = <ViewModelType extends IAnyModelType>(
  Comp: React.FC<{ vmInstance: Instance<ViewModelType>, children?: React.ReactNode;}>,
  viewModel: ViewModelType, 
) => {
  const View = (props: SnapshotIn<ViewModelType> & { children?: React.ReactNode; }) => {
    const getter = useInstanceGetter(viewModel);
    let instance: Instance<ViewModelType>;
    let MstScopeProvider: ({ children }: { children: React.ReactNode; }) => JSX.Element;

    if (getter) {
      const getterRes = getter(props);
      instance = getterRes.instance;
      MstScopeProvider = getterRes.MstScopeProvider
    } else {
      const instanceAndProvider = createMSTInstanceWithProvider(viewModel, props);
      instance = instanceAndProvider.instance;
      MstScopeProvider = instanceAndProvider.MstScopeProvider
    }
  
    const ObserverComp = observer(Comp)

    return (
      <MstScopeProvider>
        <ObserverComp vmInstance={instance}>
          { props.children }
        </ObserverComp>
      </MstScopeProvider>
    )
  }

  return observer(View)
}