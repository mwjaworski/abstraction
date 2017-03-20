import { IMonad, IFunctor, IApply, IApplicative, IChain, ISetoid, IFilterable, IBifunctor, ICatamorphism } from '../core/algebra';
import { type, toString, IToStringFn, ITypeFn } from '../core/id';
import _ from 'lodash';

export interface IEither<A> extends IMonad<A>, ISetoid<A>, IFilterable<A>, IBifunctor<A>, ICatamorphism<A> {
  readonly isLeft: () => boolean;
  readonly isRight: () => boolean;
}
export class Either {
  static of<A>(value: A): IEither<A> {
    return new Right<A>(value);
  }
  static Right<A>(value: A): IRight<A> {
    return new Right<A>(value);
  }
  static Left<A>(value: A): ILeft<A> {
    return new Left<A>(value);
  }
}

export interface ILeft<A> extends IEither<A> {

}
class Left<A> implements ILeft<A> {

  private _value: A;

  constructor(v: A) {
    this._value = v;
  }

  isLeft(): boolean {
    return true;
  }

  isRight(): boolean {
    return false;
  }

  static of<A>(value: A): IEither<A> {
    return new Left<A>(value);
  }

  of(value: A): IEither<A> {
    return Left.of(value);
  }

  orElse<B extends A>(defaultFn: () => B): A | B {
    return this._value;
  }

  equals(a: IEither<A>): boolean {
    return (a.isLeft)
      ? _.isEqual(this._value, (a as any)._value)
      : false;
  }

  bind<B>(fn: (value: A) => IEither<B>): IEither<A> {
    return this;
  }

  map<B extends A>(fn: (value: A) => B): IEither<B> {
    return this;
  }

  private _leftMap<B extends A>(fn: (value: A) => B): IEither<B> {
    return Left.of(fn(this._value));
  }

  ap<B>(monad: IEither<B>): IEither<A> {
    return this;
  }

  lift<B>(mapFn: (value: A) => B, m2: IEither<B>): IEither<A> {
    return this;
  }

  filter(fn: (value: A) => boolean): IEither<A> {
    return this;
  }

  cata<B extends A>(rightFn: (value: A) => B, leftFn: (value: A) => B): B {
    return leftFn(this._value);
  }

  bimap<B extends A>(rightFn: (value: A) => B, leftFn: (value: A) => B): IEither<B> {
    return this._leftMap(leftFn);
  }

  type: ITypeFn = type;
  toString: IToStringFn = toString;

}

export interface IRight<A> extends IEither<A> {

}
class Right<A> implements IRight<A> {

  private _value: A;

  constructor(v: A) {
    this._value = v;
  }

  isLeft(): boolean {
    return false;
  }

  isRight(): boolean {
    return true;
  }

  static of<A>(value: A): IEither<A> {
    return new Right<A>(value);
  }

  of(value: A): IEither<A> {
    return Right.of(value);
  }

  orElse<B extends A>(defaultFn: () => B): A | B {
    return this._value;
  }

  equals(a: IEither<A>): boolean {
    return (a.isRight)
      ? _.isEqual(this._value, (a as any)._value)
      : false;
  }

  bind<B>(fn: (value: A) => IEither<B>): IEither<B> {
    return fn(this._value);
  }

  map<B>(fn: (value: A) => B): IEither<B> {
    return Right.of(fn(this._value));
  }

  ap<B>(monad: IEither<B>): IEither<B> {
    return monad.map((fn: any): A | B => fn(this._value)) as IEither<B>;
  }

  lift<B>(mapFn: (value: A) => B, m2: IEither<B>): IEither<B> {
    return this.map(mapFn).ap(m2) as IEither<B>;
  }

  filter(fn: (value: A) => boolean): IEither<A> {
    return (fn(this._value))
      ? Right.of<A>(this._value)
      : Left.of<A>(this._value);
  }

  // TODO review Fantasyland spec for order of functions in cata
  cata<B extends A>(rightFn: (value: A) => B, leftFn: (value: A) => B): B {
    return rightFn(this._value);
  }

  bimap<B extends A>(rightFn: (value: A) => B, leftFn: (value: A) => B): IEither<B> {
    return this.map(rightFn);
  }

  type: ITypeFn = type;
  toString: IToStringFn = toString;

}
