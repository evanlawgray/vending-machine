const fillMachine = (initialStock, totalSlots) => {
  const inventory = {};
  const numOfSlots = totalSlots;

  for(let i = 1; i < numOfSlots + 1; i++) {
    inventory[i] = initialStock[i - 1];
  }

  return inventory;
}

module.exports = fillMachine;
