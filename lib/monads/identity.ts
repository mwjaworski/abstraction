import { IMonad, IFunctor, IApply, IApplicative, IChain, ISetoid } from '../core/algebra';
import { type, toString, IToStringFn, ITypeFn } from '../core/id';
import { 
  isEqual as _isEqual 
} from 'lodash/fp';

export interface IIdentity<A> extends IMonad<A>, ISetoid<A> {

}
export class Identity<A> implements IIdentity<A> {

  private _value: A;

  constructor(v: A) {
    this._value = v;
  }

  static of<A>(value: A): Identity<A> {
    return new Identity(value);
  }

  of(value: A): Identity<A> {
    return Identity.of(value);
  }

  orElse<B extends A>(defaultFn: () => B): A | B {
    return this._value;
  }

  equals(a: Identity<A>): boolean {
    return _isEqual(this._value, a._value);
  }

  bind<B>(fn: (value: A) => IMonad<B>): IMonad<B> {
    return fn(this._value);
  }

  map<B>(fn: (value: A) => B): IMonad<B> {
    return Identity.of(fn(this._value));
  }

  ap<B>(monad: IMonad<B>): IMonad<B> {
    return monad.map(this._value as any) as IMonad<B>;
  }

  lift<B>(mapFn: (value: A) => B, m2: IMonad<B>): IMonad<B> {
    return this.map(mapFn).ap(m2) as IMonad<B>;
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;

}
