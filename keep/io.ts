import { IMonad } from '../core/algebra';
import { type, toString, IToStringFn, ITypeFn } from '../core/shared';

export type d<E, W> = (Ealue: E) => W;
export type w<W> = () => W;

export class IO<E> implements IMonad<E> {

  private __value: () => E;

  constructor(effectFn: () => E) {
    this.__value = effectFn;
  }

  static of<E>(effect: E): IO<E> {
    return new IO(() => effect);
  }

  of(effect: E): IO<E> {
    return IO.of(effect);
  }

  orSome<W>(someValue: W): IO<E | W> {
    const effect = this.run();
    return IO.of((effect != null) ? effect : someValue);
  }

  orElse<W>(elseValue: IO<W>): IO<E | W> {
    const effect = this.run();
    return (effect != null) ? IO.of(effect) : elseValue;
  }

  run(): E {
    return this.__value();
  }

  chain<W>(fn: (effect: E) => IO<W>): IO<W> {
    return new IO(() => fn(this.run()).run());
  }

  map<W>(fn: (effect: E) => W): IO<W> {
    return new IO(() => fn(this.run()));
  }

  // TODO figure out the type of `fn` from the map
  ap<W extends E, Y extends E>(io: IO<Y>): IO<W> {
    return io.map((fn: any) => fn(this.run() as Y));
  }

  reduce<B>(fn: (acc: B, element: E) => B, acc: B): IO<B> {
    return new IO<B>(() => fn(acc, this.run()));
  }

  toString: IToStringFn = toString;
  type: ITypeFn = type;

}
