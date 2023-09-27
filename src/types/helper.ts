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