const {ethers, upgrades} = require("hardhat");

async function main() {
  const EthBankV2 = await ethers.getContractFactory('EthBankV2');
  console.log('Upgrading EthBank V1 to V2...');
  const upgradedEthBank = await upgrades.upgradeProxy('0xd79b45022443742AFbfce5d6Afc96845EB0C0F0b', EthBankV2);
  console.log('Upgraded to EthBank V2:', upgradedEthBank.address);
  // deployed Address: 0xd79b45022443742AFbfce5d6Afc96845EB0C0F0b
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
