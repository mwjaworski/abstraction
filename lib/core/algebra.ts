export interface IFunctor<A> {
  map<B>(fn: (value: A) => B): IMonad<B>;
}

export interface IApply<A> extends IFunctor<A> {
  ap<B, F>(monad: IMonad<F>): IMonad<B>;
}

export interface IChain<A> extends IApply<A> {
  chain<B>(fn: (value: A) => IMonad<B>): IMonad<B>;
}

export interface IApplicative<A> extends IApply<A> {
  of(value: A): IMonad<A>;
}

export interface IFoldable<A> {
  reduce<B>(fn: (acc: B, element: A) => B, acc: B): IMonad<B>;
}

export interface IValue<A> {
}

export interface IMonad<A> extends IApplicative<A>, IChain<A>, IFoldable<A> {
  orElse<B>(elseValue: IMonad<B>): IMonad<A | B>;
  orSome<B>(someValue: B): A | B;
  toString(): string;
  type(): string;
}

export interface ICatamorphism<A> {
  cata (success: (value: A) => A, fail: (value: A) => A): A;
}

export interface ISemigroup<A> {
  concat<B>(semigroup: ISemigroup<A>): ISemigroup<B>;
}
