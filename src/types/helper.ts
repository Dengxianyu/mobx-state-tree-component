/**
 * @desc: 为 ts 提供更好的使用，绝大部分是泛型
 */

// 为了 interface 可以匹配，所以只能使用 any
export type AnyObj = Record<string, any>;

/** 取出对象的值的类型 */
export type ValueOf<T extends AnyObj> = {
  [P in keyof T]: T[P];
}[keyof T];

/** 将对象展开展示以提升 ts 可读性  */
export type Expand<T, OnlyFirstDeep extends boolean = true> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: OnlyFirstDeep extends true ? O[K] : Expand<O[K]> }
    : never
  : T;

/** 为了对象类型的覆盖 */
export type ObjectAssign<T extends Record<string, any>, K extends Record<string, any>> = T extends Record<string, any> ? {
  [P in keyof T | keyof K]-?: P extends keyof K ? K[P] : P extends keyof T ? T[P] : never;
} : T;

/** 去除 undefined */
export type ExcludeUndefined<T extends Record<string, any> | undefined> = Exclude<T, undefined>;

/** 判断是否是数组 */
export type IsArray<T extends Record<string, any>> = T extends any[] ? true : false;

/** 判断是否是Map结构普通对象 */
export type IsObject<T extends Record<string, any>> = IsArray<T> extends true
  ? false
  : T extends Record<string, any>
  ? true
  : false;

type _SetRequiredByKeys<
  T extends Record<string, any>,
  K extends keyof T = keyof T,
> = T extends any[]
  ? SetRequiredByKeys<T[number]>[]
  : ObjectAssign<
      T,
      {
        [P in K]-?: ExcludeUndefined<T[P]> extends any[]
          ? Array<SetRequiredByKeys<T[P]>[number]>
          : IsObject<ExcludeUndefined<T[P]>> extends true
          ? SetRequiredByKeys<T[P]>
          : Required<T[P]>;
      }
    >;
/** 将 T 中 K 属性集合变成 required，如果属性值是复杂对象会将其整个都 required */
export type SetRequiredByKeys<
  T extends Record<string, any> | undefined,
  K extends keyof ExcludeUndefined<T> = keyof ExcludeUndefined<T>,
> = _SetRequiredByKeys<ExcludeUndefined<T>, K>;

type _SetRequiredExcludeKeys<
  T extends Record<string, any>,
  K extends keyof T = keyof T,
> = ObjectAssign<
  SetRequiredByKeys<T>,
  {
    [P in K]?: T[P];
  }
>;
/** // 将 T 中除了 K 属性集合以外的其他属性都变成 required，如果属性值是复杂对象会将其整个都 required */
export type SetRequiredExcludeKeys<
  T extends Record<string, any> | undefined,
  K extends keyof ExcludeUndefined<T> = keyof ExcludeUndefined<T>,
> = Expand<_SetRequiredExcludeKeys<ExcludeUndefined<T>, K>, false>;