import { IMonad } from '../core/algebra';
import { Either } from './either';
import { Validation } from './validation';
import { type, toString, IToStringFn, ITypeFn } from '../core/shared';

export class Maybe {
  static of<A>(value: A | null | undefined): Just<A> | Nothing<A> {
    return (value !== null && value !== undefined)
      ? new Just<A>(value)
      : new Nothing<A>();
  }
  static Just<A>(value: A): Just<A> {
    return new Just<A>(value);
  }
  static Nothing<A>(value?: A): Nothing<A> {
    return new Nothing<A>();
  }
}

export interface IMaybe<A> extends IMonad<A> {
  readonly isNothing: () => boolean;
  readonly isJust: () => boolean;
}

class Nothing<A> implements IMaybe<A> {

  isNothing(): boolean {
    return true;
  }

  isJust(): boolean {
    return false;
  }

  static of<B>(_0?: any): Nothing<B> {
    return new Nothing<B>();
  }

  of<A>(_0?: any): Nothing<A> {
    return Nothing.of<A>();
  }

  orSome<B>(someValue: B): A | B {
    return someValue;
  }

  orElse<B>(elseValue: IMaybe<B>): IMaybe<A | B> {
    return elseValue;
  }

  chain<B>(fn: (value: A) => IMaybe<B>): IMaybe<B> {
    return Maybe.Nothing<B>();
  }

  map<B>(fn: (value: A) => B): IMaybe<B> {
    return Maybe.Nothing<B>();
  }

  ap<B>(monad: IMaybe<B>): IMaybe<B> {
    return monad;
  }

  reduce<B>(fn: (acc: B, value: A) => B, acc: B): IMaybe<B> {
    return Maybe.Nothing<B>();
  }

  toEither(failureValue: any) {
    return Either.Left(failureValue);
  }

  toValidation(failureValue: any) {
    return Validation.Success(failureValue);
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;

}

class Just<A> implements IMaybe<A> {

  private __value: A;

  constructor(v: A) {
    this.__value = v;
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

  orSome<B>(someValue: B): A | B {
    return this.__value;
  }

  orElse<B>(elseValue: IMaybe<B>): IMaybe<A | B> {
    return this;
  }

  chain<B>(fn: (value: A) => IMaybe<B>): IMaybe<B> {
    return fn(this.__value);
  }

  map<B>(fn: (value: A) => B): IMaybe<B> {
    return Maybe.of(fn(this.__value));
  }

  ap<B>(monad: IMaybe<B>): IMaybe<B> {
    return monad.map(this.__value as any) as IMaybe<B>;
  }

  reduce<B>(fn: (acc: B, value: A) => B, acc: B): IMaybe<B> {
    return Just.of<B>(fn(acc, this.__value));
  }

  toEither(_0: void) {
    return Either.Right(this.__value);
  }

  toValidation(_0: void) {
    return Validation.Success(this.__value);
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;

}
