const restock = ( payload ) => {

  const inventoryKeys = Object.keys(this.inventory);

  inventoryKeys.forEach( key => {
    if( this.inventory[key].productId === payload.productId ) {
      console.log('found it!');
      inventory[key].productQuantity += payload.productQuantity;
    }
  })
};

module.exports = restock;
