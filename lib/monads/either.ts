import { IMonad, ICatamorphism } from '../core/algebra';
import { Maybe } from './maybe';
import { Validation } from './validation';
import { type, toString, IToStringFn, ITypeFn } from '../core/shared';

export class Either {
  static of<A>(value: A): Right<A> | Left<A> {
    return new Right<A>(value);
  }
  static Right<A>(value: A): Right<A> {
    return new Right<A>(value);
  }
  static Left<A>(value: A): Left<A> {
    return new Left<A>(value);
  }
}

export interface IEither<A> extends IMonad<A>, ICatamorphism<A> {
  readonly isLeft: () => boolean;
  readonly isRight: () => boolean;
}

class Left<E> implements IEither<E> {

  private __value: E;

  constructor(error: E) {
    this.__value = error;
  }

  isLeft(): boolean {
    return true;
  }

  isRight(): boolean {
    return false;
  }

  static of<E>(error: E): IEither<E> {
    return new Left<E>(error);
  }

  of(error: E): IEither<E> {
    return Left.of(error);
  }

  orSome<B extends E>(someValue: B): E | B {
    return someValue;
  }

  orElse<B extends E>(elseValue: IEither<B>): IEither<E | B> {
    return elseValue;
  }

  chain<B>(fn: (value: E) => IEither<B>): IEither<E> {
    return this;
  }

  map<B extends E>(fn: (value: E) => B): IEither<B> {
    return this;
  }

  ap<B>(monad: IEither<B>): IEither<E> {
    return this;
  }

  reduce<B extends E>(fn: (acc: B, element: E) => B, acc: B): IEither<B> {
    return this;
  }

  cata<B extends E>(rightFn: (value: E) => B, leftFn: (value: E) => B): B {
    return leftFn(this.__value);
  }

  toMaybe() {
    return Maybe.Nothing();
  }

  toValidation() {
    return Validation.Failure(this.__value);
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;
}

class Right<A> implements IEither<A> {

  private __value: A;

  constructor(v: A) {
    this.__value = v;
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

  orSome<B>(someValue: B): A | B {
    return this.__value;
  }

  orElse<B>(elseValue: IEither<B>): IEither<A | B> {
    return this;
  }

  chain<B>(fn: (value: A) => IEither<B>): IEither<B> {
    return fn(this.__value);
  }

  map<B>(fn: (value: A) => B): IEither<B> {
    return Right.of(fn(this.__value));
  }

  ap<B>(monad: IEither<B>): IEither<B> {
    return monad.map(this.__value as any) as IEither<B>;
  }

  reduce<B>(fn: (acc: B, value: A) => B, acc: B): IEither<B> {
    return Right.of<B>(fn(acc, this.__value));
  }

  cata<B extends A>(rightFn: (value: A) => B, leftFn: (value: A) => B): B {
    return rightFn(this.__value);
  }

  toMaybe() {
    return Maybe.Just(this.__value);
  }

  toValidation() {
    return Validation.Success(this.__value);
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;
}
