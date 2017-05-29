const fillMachine = require( '../src/fillMachine' );

describe( 'fillMachine (in constructor)', () => {

  const test = {};

  test.slots = 4;

  test.initialStock = [
      {
        productId: 1,
        productName: 'mars bar',
        productQuantity: 20
      },
      {
        productId: 2,
        productName: 'twix',
        productQuantity: 20
      },
      {
        productId: 3,
        productName: 'm&ms',
        productQuantity: 20
      },
      {
        productId: 4,
        productName: 'payday',
        productQuantity: 20
      }
    ]

    test.subject = fillMachine( test.initialStock, test.slots );

    describe( 'inventory', () => {

      beforeEach(() => {
        test.inventory = {
          1: {
            productId: 1,
            productName: 'mars bar',
            productQuantity: 20
          },
          2: {
            productId: 2,
            productName: 'twix',
            productQuantity: 20
          },
          3: {
            productId: 3,
            productName: 'm&ms',
            productQuantity: 20
          },
          4: {
            productId: 4,
            productName: 'payday',
            productQuantity: 20
          }
        }
      });

      it( 'should return an inventory object identical to test.inventory', () => {
        expect( test.subject ).toEqual( test.inventory );
      });
    });
});
