
const VendingMachine = require('../src/vending-machine');

describe('vendingMachine', () => {
  let test = {};

  beforeEach(() => {

    test.inventory = {
      1: {
        productId: 1,
        productName: 'mars bar',
        productPrice: 1.75,
        productQuantity: 10
      },
      2: {
        productId: 2,
        productName: 'twix',
        productPrice: 2.00,
        productQuantity: 10
      },
      3: {
        productId: 3,
        productName: 'm&ms',
        productPrice: 2.50,
        productQuantity: 10
      },
      4: {
        productId: 4,
        productName: 'payday',
        productPrice: 3.15,
        productQuantity: 10
      }
    }

    test.vendingMachine = new VendingMachine(test.inventory);
  });

  describe('.restock', () => {

    test.itemId = 0;
    test.newItemsAdded = 10;

    beforeEach(() => {
      test.itemId++;
      test.subject = new VendingMachine(test.inventory);
      test.subject.restockItem({ productId: test.itemId, productQuantity: test.newItemsAdded });
    });

    it('should increment the first item\'s productQuantity by 10', () => {
      expect(test.subject.inventory[1].productQuantity).toEqual(20)
    });

    it('should increment the second item\'s productQuantity by 10', () => {
      expect(test.subject.inventory[2].productQuantity).toEqual(20)
    });

    it('should increment the third item\'s productQuantity by 10', () => {
      expect(test.subject.inventory[3].productQuantity).toEqual(20)
    });

    it('should increment the fourth item\'s productQuantity by 10', () => {
      expect(test.subject.inventory[4].productQuantity).toEqual(20)
    });
  });

  describe('.printInventory', () => {
    beforeEach(() => {
      test.subject = new VendingMachine(test.inventory);
    });

    it('should console.log the vending machine\'s inventory', () => {
      const spy = jest.spyOn(test.subject, 'printInventory');
      const isPrinting = test.subject.printInventory();

      expect(spy).toHaveBeenCalled();
      expect(isPrinting).toBe(true);

      spy.mockReset();
      spy.mockRestore();
    });
  });

  describe('.refillChange', () => {

    beforeEach(() => {
      test.coinsAdded = 50;
      test.subject = new VendingMachine(test.inventory);
    });

    it('should increment the toonies count in changeStore by 50', () => {
      test.subject.refillChange( {changeType: 'toonies', quantity: test.coinsAdded} );
      expect(test.subject.changeStore.toonies.quantity).toEqual(100);
    });

    it('should increment the loonies count in changeStore by 50', () => {
      test.subject.refillChange( {changeType: 'loonies', quantity: test.coinsAdded} );
      expect(test.subject.changeStore.loonies.quantity).toEqual(100);
    });

    it('should increment the quarters count in changeStore by 50', () => {
      test.subject.refillChange( {changeType: 'quarters', quantity: test.coinsAdded} );
      expect(test.subject.changeStore.quarters.quantity).toEqual(100);
    });

    it('should increment the dimes count in changeStore by 50', () => {
      test.subject.refillChange( {changeType: 'dimes', quantity: test.coinsAdded} );
      expect(test.subject.changeStore.dimes.quantity).toEqual(100);
    });

    it('should increment the nickels count in changeStore by 50', () => {
      test.subject.refillChange( {changeType: 'nickels', quantity: test.coinsAdded} );
      expect(test.subject.changeStore.nickels.quantity).toEqual(100);
    });
  });

  describe('.purchaseItem', () => {

    beforeEach(() => {
      test.subject = new VendingMachine(test.inventory);
    });

    it(`should return change and return a mars bar and decrement mars quantity
    by one (if sufficient change is given)`, () => {

      const result = test.subject.purchaseItem({
        productId: 1,
        changeGiven: {
          toonies: 1,
          loonies: 1,
          dimes: 3
        }
      });

      expect( result ).toEqual({
        item: 'mars bar',
        quantity: 1,
        change: {
          loonies: 1,
          quarters: 2,
          nickels: 1
        }
      });

      expect( test.subject.inventory[1].productQuantity ).toEqual( 9 );
    });

    it( 'should throw an error if insufficient change is given', () => {
      expect( () => test.subject.purchaseItem({
        productId: 1,
        changeGiven: {
          loonies: 1,
          quarters: 2
        }
      })).toThrow( 'Insufficient change given' );
    });

    describe('.getChangeValue', () => {

      beforeEach(() => {
        test.subject = new VendingMachine( test.inventory );
      });

      it( `should return an object with the shape{
        changeGiven: {<list of coins with quantities>},
        changeValue: 3.4
      }`, () => {

        expect( test.subject.getChangeValue( {
          toonies: 1,
          loonies: 1,
          quarters: 1,
          dimes: 1,
          nickels: 1
        })).toEqual({
          changeGiven: {
            toonies: 1,
            loonies: 1,
            quarters: 1,
            dimes: 1,
            nickels: 1
          },
          changeValue: 3.40
        });
      });
    });

    describe('.getChange', () => {

      beforeEach(() => {
        test.subject = new VendingMachine( test.inventory );
      });

      it( `should return a single $2 coin if $2 is the change amount`, () => {

          expect( test.subject.getChange( 2.00 ) ).toEqual({ toonies: 1 })
      });

      it( `should return a single $1 coin and 3 quarters if
        $1.75 is the change amount`, () => {

          expect( test.subject.getChange( 1.75 ) ).toEqual({ loonies: 1, quarters: 3 })
      });

      it( `should return a single $2 coin, 1 dime and 1 nickel if
        $2.15 is the change amount`, () => {

          expect( test.subject.getChange( 2.15 ) ).toEqual({ toonies: 1, dimes: 1, nickels: 1 })
      });

      it( `should return a 3 $2 coins, 1 $1 coin, 3 quarters, 1 dime
        and 1 nickel if $7.90 is the change amount`, () => {

          expect( test.subject.getChange( 7.90 ) ).toEqual({ toonies: 3, loonies: 1, quarters: 3, dimes: 1, nickels: 1 })
      });
    });

    describe('.addChangeToStore', () => {

      beforeEach(() => {
        test.subject = new VendingMachine(test.inventory);
      });

      it( `should increment quantity of each change type in the
        change store by one given a change object of the shape: {
          toonies: 1,
          loonies: 1,
          quarters: 1,
          dimes: 1,
          nickels: 1
        }`, () => {

        test.subject.addChangeToStore({
          toonies: 1,
          loonies: 1,
          quarters: 1,
          dimes: 1,
          nickels: 1
        });

        expect( test.subject.changeStore ).toEqual({
          toonies: { quantity: 51, value: 2.00 },
          loonies: { quantity: 51, value: 1.00 },
          quarters: { quantity: 51, value: 0.25 },
          dimes: { quantity: 51, value: 0.10 },
          nickels: { quantity: 51, value: 0.05 },
        });
      });
    });
  });
});
