import { IMonad } from '../core/algebra';
import { type, toString, IToStringFn, ITypeFn } from '../core/shared';

export interface IIdentity<A> extends IMonad<A> {
  
}
export class Identity<A> implements IMonad<A> {

  private __value: A;

  constructor(v: A) {
    this.__value = v;
  }

  static of<U>(value: U): Identity<U> {
    return new Identity(value);
  }

  of(value: A): Identity<A> {
    return Identity.of(value);
  }

  orSome<B extends A>(someValue: B): A | B {
    return this.__value;
  }

  orElse<B extends A>(elseValue: Identity<B>): Identity<A | B> {
    return this;
  }

  chain<B>(fn: (value: A) => Identity<B>): Identity<B> {
    return fn(this.__value);
  }

  map<B>(fn: (value: A) => B): Identity<B> {
    return Identity.of<B>(fn(this.__value));
  }

  ap<B>(monad: Identity<B>): Identity<B> {
    return monad.map(this.__value as any) as Identity<B>;
  }

  reduce<B>(fn: (acc: B, value: A) => B, acc: B): Identity<B> {
    return Identity.of<B>(fn(acc, this.__value));
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;
}