const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("EthBankV2", function() {
  let EthBank;
  let deployedEthBank;
  let deployedEthBankAddress;
  let owner;
  let addr;

  beforeEach(async function() {
    [owner, addr] = await ethers.getSigners();

    EthBank = await ethers.getContractFactory('EthBank');
    deployedEthBank = await upgrades.deployProxy(EthBank, { initializer: 'initialize' });
    await deployedEthBank.deployed();
    deployedEthBankAddress = deployedEthBank.address;
  })

  it("Can transfer after Upgrade", async function () {
      const EthBankV2 = await ethers.getContractFactory('EthBankV2');
      const upgradedEthBank = await upgrades.upgradeProxy(deployedEthBankAddress, EthBankV2);

      await expect(upgradedEthBank.address).to.equal(deployedEthBankAddress);

      await upgradedEthBank.connect(owner).register();
      await upgradedEthBank.connect(addr).register();
      await upgradedEthBank.connect(owner).deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")});
      await upgradedEthBank.connect(owner).transfer(addr.address, ethers.utils.parseEther("0.5"));
      await expect(await upgradedEthBank.connect(owner).getBalance()).to.equal(ethers.utils.parseEther("0.5"));
      await expect(await upgradedEthBank.connect(addr).getBalance()).to.equal(ethers.utils.parseEther("0.5"));
  });
});
