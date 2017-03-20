import { IMonad, IFunctor, IApply, IApplicative, IChain, ISetoid } from '../core/algebra';
import { type, toString, IToStringFn, ITypeFn } from '../core/id';

export type effect_fn<V> = () => V;
export type value_fn<V, W> = (value: V) => W;

export class IO<V> {

  private _effect: effect_fn<V>;

  constructor(effect: effect_fn<V>) {
    this._effect = effect;
  }

  static of<V>(effect: effect_fn<V>): IO<V> {
    return new IO(effect);
  }

  of(effect: effect_fn<V>): IO<V> {
    return IO.of(effect);
  }

  bind<W>(fn: (effect: V) => IO<W>): IO<W> {
    return IO.of(() => fn(this._effect()).run());
  }

  map<W>(fn: value_fn<V, W>): IO<W> {
    return IO.of(() => fn(this._effect()));
  }

  ap<W, Y extends value_fn<V, W>>(io: IO<Y>): IO<W> {
    return io.map((fn: value_fn<V, W>) => fn(this._effect()));
  }

  lift<W, Z, Y extends value_fn<W, Z>>(fn: value_fn<V, W>, io: IO<Y>): IO<Z> {
    return this.map(fn).ap(io) as IO<Z>;
  }

  run(): V {
    return this._effect();
  }

  orElse<X>(defaultFn: effect_fn<X>): V | X {
    return (typeof this._effect !== 'function')
      ? defaultFn()
      : this.run();
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;

}
