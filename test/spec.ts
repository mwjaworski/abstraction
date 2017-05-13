import * as mocha from 'mocha';
import { expect } from 'chai';
import { IMonad } from '../lib/core/algebra';
import { Identity, IIdentity } from '../lib/monads/identity';
import { Maybe, IMaybe } from '../lib/monads/maybe';
import { Either, IEither } from '../lib/monads/either';
import { Validation, IValidation } from '../lib/monads/validation';
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
        .orSome('undefined');

      expect(get).to.equal('40%');

    });

  });

  describe('Maybe', function (): void {

    it('should output a value with `toString` of Just(_)', () => {

      expect(Maybe.of(6).toString()).to.equal('Just(6)');
      expect(Maybe.of(12).toString()).to.equal('Just(12)');

    });

    it('should output a value with `toString` of Nothing', () => {

      expect(Maybe.Nothing(6).toString()).to.equal('Nothing()');

    });

    it('should allow ap to apply methods', () => {

      const namePerson: CurriedFunction3<string, string, string, string> = _.curry(function (forename: string, surname: string, address: string): string {
        return `${forename} ${surname} lives in ${address}`;
      });

      const personName: string = Maybe.of(namePerson)
        .ap(Maybe.of('Tom'))
        .ap(Maybe.of('Baker'))
        .ap(Maybe.of('Dulwich, London'))
        .orSome(undefined) as string;

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
        .orSome(undefined) as number;

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
        .orSome('or else') as number;

      expect(value).to.equal('or else');

    });

    it('should handle errors', () => {

      const value: string = Maybe
        .of<string>(null)
        .map((_v: string): string => _v + 'added')
        .toString() as string;

      expect(value).to.equal(`Nothing()`);

    });

    it('should handle an error when we begin with good data', () => {

      const value: Object = Maybe
        .of<Object>({
          name: 'Test'
        })
        .map(_.property('does-not-exist'))
        .map((v: number): number => v + 10)
        .toString() as string;

      expect(value).to.equal(`Nothing()`);

    });

  });

  describe('Either', function (): void {

    it('should output a value with `toString`', () => {

      expect(Either.Right<number>(6).toString()).to.equal('Right(6)');

    });

    it('should carry a Right value', () => {

      const value: Object = Either
        .Right<Object>({
          name: 'Test'
        })
        .map(_.property('name'))
        .map((v: string): string => `${v} Passed`)
        .toString() as string;

      expect(value).to.equal(`Right(Test Passed)`);

    });

    it('should carry a Left value', () => {

      const div: Function = (a: number, b: number): IEither<number | string> => {
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

  describe('Validation', function (): void {

    it('should output a value with `toString`', () => {

      expect(Validation.Success<number>(6).toString()).to.equal('Success(6)');

    });

    it('should carry a Success value', () => {

      const value: Object = Validation
        .Success<Object>({
          name: 'Test'
        })
        .map(_.property('name'))
        .map((v: string): string => `${v} Passed`)
        .toString() as string;

      expect(value).to.equal(`Success(Test Passed)`);

    });

    it('should carry a Failure value', () => {

      const div: Function = (a: number, b: number): IValidation<number | string> => {
        return (b === 0)
          ? Validation.Failure<string>('Division by 0.')
          : Validation.Success<number>(a / b);
      };

      const value1: string = div(3, 0)
        .map((v: number): number => v + 1)
        .toString() as string;

      expect(value1).to.equal(`Failure(Division by 0.)`);

      const value2: string = div(3, 1)
        .map((v: number): number => v + 1)
        .toString() as string;

      expect(value2).to.equal(`Success(4)`);

    });

    const tax = (tax: number, price: any): IValidation<any | number | Error> => {

      if (!_.isNumber(price)) {
        return Validation.Failure('Price must be numeric (tax)');
      }

      return Validation.Success(price + (tax * price));
    };

    const discount = (dis: number, price: any): IValidation<any | number | Error> => {

      if (!_.isNumber(price)) {
        return Validation.Failure('Price must be numeric (discount)');
      }

      if (price < 10) {
        return Validation.Failure('discount cant be applied for items priced below 10');
      }

      return Validation.Success(price - (price * dis));
    };

    it('should carry multiple Failures', () => {

      const priceCalculator: any = (price: string) => (price: string) => price;
      const calculatePriceFailure: string = Validation.Success(priceCalculator)
        .ap(discount(0.2, '2.00'))
        .ap(tax(0.99, '2.00'))
        .toString() as string;

      expect(calculatePriceFailure).to.equal(`Failure(Price must be numeric (discount),Price must be numeric (tax))`);
    });

    it('should carry succeed and not capture multiple Failures', () => {

      const priceCalculator: any = (price: string) => (price: string) => price;
      const calculatePriceSuccess: string = Validation.Success(priceCalculator)
        .ap(discount(0.2, 20.00))
        .ap(tax(0.99, 20.00))
        .toString() as string;

      expect(calculatePriceSuccess).to.equal('Success(39.8)');

    });

  });
});
