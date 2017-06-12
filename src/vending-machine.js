jest.setMock(
  '../src/fillMachine.js',
  require('../__mocks__/fillMachine')
)

const fillMachine = require('./fillMachine');
let restock1 = require('./restock');

class VendingMachine {
  constructor( initialStock ) {

    this.numOfSlots = 4;

    this.changeStore = {
      toonies: { quantity: 50, value: 2.00 },
      loonies: { quantity: 50, value: 1.00 },
      quarters: { quantity: 50, value: 0.25 },
      dimes: { quantity: 50, value: 0.10 },
      nickels: { quantity: 50, value: 0.05 }
    }

    this.changeStoreKeys = Object.keys( this.changeStore );

    this.inventory = fillMachine( initialStock, this.numOfSlots );
    this.inventoryKeys = Object.keys( this.inventory );
  }

  printInventory() {
    console.log( 'REMAINING INVENTORY:' );

    this.inventoryKeys.forEach( key => {
      console.log(this.inventory[key]);
    });

    console.log(`To purchase an item, call the .purchaseItem method with an argument
      of the shape: {
        productId: <product id number>,
        changeGiven: {
          <change type>: <integer>,
          <change type>: <integer>,
          <change type>: <integer>,
          ...
        }
      }

    This vending machine takes toonies, loonies, quarters, dimes and nickels` );

    return true;
  }

  restockItem( payload ) {
    this.inventoryKeys.forEach( key => {
      if( this.inventory[key].productId === payload.productId ) {
        this.inventory[key].productQuantity += payload.productQuantity;
      }
    });
  }

  refillChange( payload ) {
    this.changeStoreKeys.forEach( key => {
      if(key === payload.changeType) this.changeStore[key].quantity += payload.quantity;
    });
  }

  getChangeValue( change ) {
    const changeGiven = Object.assign( {}, change );
    const changeGivenKeys = Object.keys( changeGiven );

    const paymentInfo = changeGivenKeys.reduce(( info, key ) => {
      if( key === 'toonies' && changeGiven[key] ) info.changeValue += ( changeGiven[key] * 2 );
      if( key === 'loonies' && changeGiven[key] ) info.changeValue += ( changeGiven[key] * 1 );
      if( key === 'quarters' && changeGiven[key] ) info.changeValue += ( changeGiven[key] * 0.25 );
      if( key === 'dimes' && changeGiven[key] ) info.changeValue += ( changeGiven[key] * 0.10 );
      if( key === 'nickels' && changeGiven[key] ) info.changeValue += ( changeGiven[key] * 0.05 );

      return info;
    }, { changeGiven: changeGiven, changeValue: 0 });

    return paymentInfo;
  }

  getChange( diff ) {
    let balance = diff;
    if(balance === 0) return {};

    const change = this.changeStoreKeys.reduce( (returnedChange, key) => {
      const changeType = this.changeStore[key];

        // While the remaining balance is equal to or greater than the value
        // of the coin type being iterated over, add another of those coins
        // to the returned change object and appropriately decrement the balance
        // and the amount of coins remaining
        while( balance >= changeType.value && balance !== 0 ) {
          returnedChange[key] ?
            returnedChange[key]++ :
            returnedChange[key] = 1;

            balance = ( balance - changeType.value ).toPrecision(4);
            changeType.quantity--;
        }

      return returnedChange;
    }, {});

    return change;
  }

  // Takes the change given by the user as payment and uses it
  // to replenish the change store

  addChangeToStore( changeGiven ) {
    const changeGivenKeys = Object.keys( changeGiven );

    changeGivenKeys.forEach( changeType => {
      this.changeStore[changeType].quantity += changeGiven[changeType];
    });
  }

  purchaseItem( payload ) {
    const itemAndChange = this.inventoryKeys.reduce( ( output, key ) => {
      if( this.inventory[key].productId === payload.productId ) {

        const item = this.inventory[key];
        const paymentInfo = this.getChangeValue( payload.changeGiven );

        if( paymentInfo.changeValue < item.productPrice ) throw 'Insufficient change given';

        // Decrement product quantity by one if customer has provided
        // sufficient payment
        this.inventory[key].productQuantity--;

        // Add the customer's payment to the changeStore

        this.addChangeToStore( payload.changeGiven );

        // Calculate the amount of coins to return as change,
        // making an allowance for payments of more than $10
        const diff = paymentInfo.changeValue < 10 ?
          (paymentInfo.changeValue - item.productPrice).toPrecision(3) :
          (paymentInfo.changeValue - item.productPrice).toPrecision(4)

        const returnedChange = this.getChange( diff );

        output.item = item.productName;
        output.quantity = 1;
        output.change = returnedChange;
      }

      return output;
    }, {});

    return itemAndChange;
  }
}

module.exports = VendingMachine;
