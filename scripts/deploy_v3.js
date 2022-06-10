const {ethers, upgrades} = require("hardhat");

async function main() {
  const EthBankV3 = await ethers.getContractFactory('EthBankV3');
  console.log('Upgrading EthBank V2 to V3...');
  const upgradedEthBank = await upgrades.upgradeProxy('0xd79b45022443742AFbfce5d6Afc96845EB0C0F0b', EthBankV3);
  console.log('Upgraded to EthBank V3:', upgradedEthBank.address);
  // deployed Address: 0xd79b45022443742AFbfce5d6Afc96845EB0C0F0b
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
