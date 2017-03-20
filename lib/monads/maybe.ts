import { IMonad, IFunctor, IApply, IApplicative, IChain, ISetoid, IFilterable } from '../core/algebra';
import { type, toString, IToStringFn, ITypeFn } from '../core/id';
import _ from 'lodash';

export interface IMaybe<A> extends IMonad<A>, ISetoid<A>, IFilterable<A> {
  readonly isNothing: () => boolean;
  readonly isJust: () => boolean;
}
export class Maybe {
  static of<A>(value: A | null | undefined): IMaybe<A> {
    return (value !== null && value !== undefined)
      ? new Just<A>(value)
      : new Nothing<A>();
  }
  static Just<A>(value: A): IJust<A> {
    return new Just<A>(value);
  }
  static Nothing<A>(value?: A): INothing<A> {
    return new Nothing<A>();
  }
}

export interface INothing<A> extends IMaybe<A> {

}
class Nothing<A> implements INothing<A> {

  static of<B>(_?: any): Nothing<B> {
    return new Nothing<B>();
  }

  isNothing(): boolean {
    return true;
  }

  isJust(): boolean {
    return false;
  }

  of<A>(_?: any): Nothing<A> {
    return Nothing.of<A>(_);
  }

  orElse<B extends A>(defaultFn: () => B): A | B {
    return defaultFn();
  }

  equals<B>(a: IMaybe<B>): boolean {
    return a.isNothing();
  }

  bind<B>(fn: (value: A) => IMaybe<B>): IMaybe<B> {
    return Maybe.Nothing<B>();
  }

  map<B>(fn: (value: A) => B): IMaybe<B> {
    return Maybe.Nothing<B>();
  }

  ap<B>(monad: IMaybe<B>): IMaybe<B> {
    return monad;
  }

  lift<B>(mapFn: (value: A) => B, m2: IMaybe<B>): IMaybe<B> {
    return m2;
  }

  filter(fn: (value: A) => boolean): IMaybe<A> {
    return Maybe.Nothing<A>();
  }

  toString(): string {
    return `${this.type()}`;
  }

  type: ITypeFn = type;

}

export interface IJust<A> extends IMaybe<A> {

}
class Just<A> implements IJust<A> {

  private _value: A;

  constructor(v: A) {
    this._value = v;
  }

  isNothing(): boolean {
    return false;
  }

  isJust(): boolean {
    return true;
  }

  static of<A>(value: A): IMaybe<A> {
    return new Just<A>(value);
  }

  of(value: A): IMaybe<A> {
    return Just.of(value);
  }

  orElse<B extends A>(defaultFn: () => B): A | B {
    return this._value;
  }

  equals(a: IMaybe<A>): boolean {
    return (a.isJust)
      ? _.isEqual(this._value, (a as any)._value)
      : false;
  }

  bind<B>(fn: (value: A) => IMaybe<B>): IMaybe<B> {
    return fn(this._value);
  }

  map<B>(fn: (value: A) => B): IMaybe<B> {
    return Maybe.of(fn(this._value));
  }

  ap<B>(monad: IMaybe<B>): IMaybe<B> {
    return monad.map(this._value as any) as IMaybe<B>;
  }

  lift<B>(mapFn: (value: A) => B, m2: IMaybe<B>): IMaybe<B> {
    return this.map(mapFn).ap(m2) as IMaybe<B>;
  }

  filter(fn: (value: A) => boolean): IMaybe<A> {
    return (fn(this._value))
      ? Just.of<A>(this._value)
      : Nothing.of<A>();
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;

}
