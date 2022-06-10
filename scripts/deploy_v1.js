const {ethers, upgrades} = require("hardhat");

async function main() {
  const EthBank = await ethers.getContractFactory('EthBank');
  console.log('Deploying EthBank V1...');
  const ethBank = await upgrades.deployProxy(EthBank, { initializer: 'initialize' });
  await ethBank.deployed();
  console.log('EthBank V1 deployed to:', ethBank.address);
  // deployed Address: 0xd79b45022443742AFbfce5d6Afc96845EB0C0F0b
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
