export interface IFunctor<A> {
  map<B>(fn: (value: A) => B): IMonad<B>;
}

export interface IApply<A> extends IFunctor<A> {
  ap<B, F>(monad: IMonad<F>): IMonad<B>;
}

export interface IApplicative<A> extends IApply<A> {
  of(value: A): IApplicative<A>;
}

export interface IChain<A> extends IApply<A> {
  bind<B>(fn: (value: A) => IMonad<B>): IMonad<B>;
}

export interface IMonad<A> extends IApplicative<A>, IChain<A> {
  orElse<B>(defaultFn: () => B): A | B;
  toString(): string;
}

export interface ISemigroup<A> {
  concat<B>(semigroup: ISemigroup<A>): ISemigroup<B>;
}

export interface IMonoid<A> extends ISemigroup<A> {
  empty(): IMonoid<A>;
}

export interface ISetoid<A> {
  equals(setoid: ISetoid<A>): boolean;
}

export interface IFoldable<A> {
  reduce<B>(fn: (fold: B, element: any) => B, b: B): IFoldable<B>;
}

export interface IFilterable<A> {
  filter(fn: (value: A) => boolean): IFunctor<A>;
}

export interface IBifunctor<A> {
  bimap(success: (value: A) => IBifunctor<A>, fail: (value: A) => IBifunctor<A>): IBifunctor<A>;
}

export interface ICatamorphism<A> {
  cata (success: (value: A) => A, fail: (value: A) => A): A;
}
