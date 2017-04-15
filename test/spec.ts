import * as mocha from 'mocha';
import { expect } from 'chai';
import { IMonad } from '../lib/core/algebra';
import { Identity, IIdentity } from '../lib/monads/identity';
import { Maybe, IMaybe } from '../lib/monads/maybe';
import { Either, IEither } from '../lib/monads/either';
import { CurriedFunction3 } from 'lodash';
import * as _ from 'lodash';

describe('Functional Algebra', function (): void {
  describe('Identity', function (): void {

    it('should output a value with `toString`', () => {

      expect(Identity.of(6).toString()).to.equal('Identity(6)');

    });

    it('should bind/map with the Identity Monad', () => {

      const correctCount = 4;

      const get: string = Identity.of(6)
        .map((wrongCount: number): number => wrongCount + correctCount)
        .map((totalCount: number): number => correctCount / totalCount)
        .map((ratio: number): number => Math.round(100 * ratio))
        .map((ratio: number): string => ratio + '%')
        .orElse(() => 'undefined');

      expect(get).to.equal('40%');

    });

  });

  describe('Maybe', function (): void {

    it('should output a value with `toString` of Just(_)', () => {

      expect(Maybe.of(6).toString()).to.equal('Just(6)');
      expect(Maybe.Just(6).toString()).to.equal('Just(6)');

    });

    it('should output a value with `toString` of Nothing', () => {

      expect(Maybe.Nothing(6).toString()).to.equal('Nothing');

    });

    it('should allow ap to apply methods', () => {

      const namePerson: CurriedFunction3<string, string, string, string> = _.curry(function (forename: string, surname: string, address: string): string {
          return `${forename} ${surname} lives in ${address}`;
      });

      const personName: string = Maybe.of(namePerson)
        .ap(Maybe.Just('Tom'))
        .ap(Maybe.Just('Baker'))
        .ap(Maybe.Just('Dulwich, London'))
        .orElse(() => undefined) as string;

      expect(personName).to.equal('Tom Baker lives in Dulwich, London');

    });

    it('should allow ap to chain', () => {

      const addFn: (n1: number, n2: number) => number = _.curry((n1: number, n2: number): number => {
        return n1 + n2;
      });

      const value: number = Maybe
        .of(2)
        .map(addFn as (n1: number) => number)
        .ap(Maybe.of(3))
        .orElse(() => undefined) as number;

      expect(value).to.equal(5);

    });

    it('should allow ap to chains to Nothing', () => {

      const addFn: (n1: number, n2: number) => number = _.curry((n1: number, n2: number): number => {
        return n1 + n2;
      });

      const value: number = Maybe
        .of(2)
        .map(addFn as (n1: number) => number)
        .ap(Maybe.Nothing(3))
        .orElse(() => 'or else') as number;

      expect(value).to.equal('or else');

    });

    it('should handle errors', () => {

      const value: string = Maybe
        .of<string>(null)
        .map((_v: string): string => _v + 'added')
        .toString() as string;

      expect(value).to.equal(`Nothing`);

    });

    it('should handle an error when we begin with good data', () => {

      const value: Object = Maybe
        .of<Object>({
          name: 'Test'
        })
        .map(_.property('does-not-exist'))
        .map((v: number): number => v + 10)
        .toString() as string;

      expect(value).to.equal(`Nothing`);

    });

  });

  describe('Either', function (): void {

    it('should output a value with `toString`', () => {

      expect(Either.of<number>(6).toString()).to.equal('Right(6)');

    });

    it('should carry a Right value', () => {

      const value: Object = Either
        .of<Object>({
          name: 'Test'
        })
        .map(_.property('name'))
        .map((v: string): string => `${v} Passed`)
        .toString() as string;

      expect(value).to.equal(`Right(Test Passed)`);

    });

    it('should carry a Left value', () => {

      const div: Function = (a: number, b: number): IEither<number |  string> => {
        return (b === 0)
          ? Either.Left<string>('Division by 0.')
          : Either.Right<number>(a / b);
      };

      const value1: string = div(3, 0)
        .map((v: number): number => v + 1)
        .toString() as string;

      expect(value1).to.equal(`Left(Division by 0.)`);

      const value2: string = div(3, 1)
        .map((v: number): number => v + 1)
        .toString() as string;

      expect(value2).to.equal(`Right(4)`);

    });

  });
});
