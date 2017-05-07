import { IMonad, ICatamorphism, ISemigroup } from '../core/algebra';
import { Either } from './either';
import { Maybe } from './maybe';
import { type, toString, IToStringFn, ITypeFn } from '../core/id';

export class Validation {
  static of<A>(value: A): Success<A> | Failure<A> {
    return new Success<A>(value);
  }
  static Success<A>(value: A): Success<A> {
    return new Success<A>(value);
  }
  static Failure<A>(value: A): Failure<A> {
    return new Failure<A>(value);
  }
}

export interface IValidation<A> extends IMonad<A>, ICatamorphism<A> {
  readonly isFailure: () => boolean;
  readonly isSuccess: () => boolean;
}

// currently only works with arrays??....
class Semigroup<A> {
  static join<A>(list: ISemigroup<A> | A[]): A {
    // what do we do with array of errors? or other...
    return (list as any).join('......') as A;
  }
  static append<A>(list: ISemigroup<A> | A[], value: A): ISemigroup<A> | A[] {
    // what do we do with array of errors? or other...
    return (list as any).concat(value) as ISemigroup<A> | A[];
  }
  static unit<A>(list: ISemigroup<A> | A[]): A {
    // what do we do with array of errors? or other...
    return list as any;
  }
}

class Failure<F> implements IValidation<F> {

  private __value: F[];

  constructor(failure: F) {
    this.__value = (failure instanceof Array)
      ? failure
      : [failure];
  }

  isFailure(): boolean {
    return true;
  }

  isSuccess(): boolean {
    return false;
  }

  static of<F>(failure: F): IValidation<F> {
    return new Failure<F>(failure);
  }

  of(failure: F): IValidation<F> {
    return Failure.of(failure);
  }

  orSome<B extends F>(someValue: B): F | B {
    return (this.__value.length > 0)
      ? this.__value as any
      : someValue;
  }

  orElse<B extends F>(elseValue: IValidation<B>): IValidation<F | B> {
    return (this.__value.length > 0)
      ? Failure.of(this.__value as any)
      : elseValue;
  }

  chain<B>(fn: (value: F) => IValidation<B>): IValidation<F> {
    return this;
  }

  map<B extends F>(fn: (value: F) => B): IValidation<B> {
    return this;
  }

  ap<B extends F>(monad: IValidation<B>): IValidation<F> {
    return Failure.of(Semigroup.unit(Semigroup.append<F>(this.__value, monad.orSome([] as any))));
  }

  reduce<B extends F>(fn: (acc: B, element: F) => B, acc: B): IValidation<B> {
    return this;
  }

  cata<B extends F>(successFn: (value: F) => B, failureFn: (value: F) => B): B {
    return failureFn(Semigroup.join(this.__value));
  }

  toMaybe(_0: void) {
    return Maybe.Nothing();
  }

  toEither(_0: void) {
    return Either.Left(this.__value);
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;
}

class Success<A> implements IValidation<A> {

  private __value: A;

  constructor(v: A) {
    this.__value = v;
  }

  isFailure(): boolean {
    return false;
  }

  isSuccess(): boolean {
    return true;
  }

  static of<A>(value: A): IValidation<A> {
    return new Success<A>(value);
  }

  of(value: A): IValidation<A> {
    return Success.of(value);
  }

  orSome<B>(someValue: B): A | B {
    return this.__value;
  }

  orElse<B>(elseValue: IValidation<B>): IValidation<A | B> {
    return this;
  }

  chain<B>(fn: (value: A) => IValidation<B>): IValidation<B> {
    return fn(this.__value);
  }

  map<B>(fn: (value: A) => B): IValidation<B> {
    return Success.of(fn(this.__value));
  }

  ap<B>(monad: IValidation<B>): IValidation<B> {
    return monad.map(this.__value as any) as IValidation<B>;
  }

  reduce<B>(fn: (acc: B, value: A) => B, acc: B): IValidation<B> {
    return Success.of<B>(fn(acc, this.__value));
  }

  cata<B extends A>(successFn: (value: A) => B, failureFn: (value: A) => B): B {
    return successFn(this.__value);
  }

  toMaybe(_0: void) {
    return Maybe.Just(this.__value);
  }

  toEither(_0: void) {
    return Either.Right(this.__value);
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;
}
