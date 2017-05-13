import { IMonad } from './algebra';

export interface ITypeFn {
  (): string;
}
export function type(): string {
  return (this.constructor as any).name;
}

export interface IToStringFn {
  (): string;
}
export function toString(): string {
  return `${this.type()}(${this.__value || ''})`;
}
