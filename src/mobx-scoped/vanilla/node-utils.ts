/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAnyComplexType } from 'mobx-state-tree';
import type { Instance } from 'mobx-state-tree/dist/internal';

// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyObject = {};

type ObjectNode<IT extends IAnyComplexType = IAnyComplexType> = {
  identifier: string | number | undefined;
  identifierAttribute: string | undefined;
  type: IT;
};

export function isStateTreeNode<IT extends IAnyComplexType = IAnyComplexType>(
  value: any,
): value is Instance<IT> & { $treenode: ObjectNode<IT> } {
  return !!(value && value.$treenode);
}

export function isTypeWithIdentifier<
  IT extends IAnyComplexType = IAnyComplexType,
>(model: IT): model is IT & { identifierAttribute: string } {
  return !!model.identifierAttribute;
}
