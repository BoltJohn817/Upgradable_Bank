const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("EthBankV3", function() {
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

  it("Can do transaction before OwnershipTransfer", async function () {
      const EthBankV3 = await ethers.getContractFactory('EthBankV3');
      const upgradedEthBank = await upgrades.upgradeProxy(deployedEthBankAddress, EthBankV3);

      await expect(upgradedEthBank.address).to.equal(deployedEthBankAddress);

      await upgradedEthBank.connect(owner).register();
      await upgradedEthBank.connect(addr).register();
      await upgradedEthBank.connect(owner).deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")});
      await upgradedEthBank.connect(owner).transfer(addr.address, ethers.utils.parseEther("0.5"));
      await expect(await upgradedEthBank.connect(owner).getBalance()).to.equal(ethers.utils.parseEther("0.5"));
      await expect(await upgradedEthBank.connect(addr).getBalance()).to.equal(ethers.utils.parseEther("0.5"));
  });

  it("Can't do transaction during OwnershipTransfer", async function () {
      const EthBankV3 = await ethers.getContractFactory('EthBankV3');
      const upgradedEthBank = await upgrades.upgradeProxy(deployedEthBankAddress, EthBankV3);

      await expect(upgradedEthBank.address).to.equal(deployedEthBankAddress);

      await upgradedEthBank.connect(owner).register();
      await upgradedEthBank.connect(owner).deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")});

      await upgradedEthBank.startOwnershipTransfer(owner.address);
      await expect(upgradedEthBank.connect(addr).register()).to.be.revertedWith("Ownership is changing now");
      await expect(upgradedEthBank.connect(owner).deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")}))
              .to.be.revertedWith("Ownership is changing now");
      await expect(upgradedEthBank.connect(owner).transfer(addr.address, ethers.utils.parseEther("0.5")))
              .to.be.revertedWith("Ownership is changing now");
      
      await upgradedEthBank.connect(owner).withdraw(ethers.utils.parseEther("0.5"));
      await expect(await upgradedEthBank.connect(owner).getBalance()).to.equal(ethers.utils.parseEther("0.5"));
  });

  it("Can do transaction after OwnershipTransfer", async function () {
      const EthBankV3 = await ethers.getContractFactory('EthBankV3');
      const upgradedEthBank = await upgrades.upgradeProxy(deployedEthBankAddress, EthBankV3);

      await expect(upgradedEthBank.address).to.equal(deployedEthBankAddress);

      await upgradedEthBank.connect(owner).register();
      await upgradedEthBank.connect(owner).deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")});

      await upgradedEthBank.startOwnershipTransfer(addr.address);
      await upgradedEthBank.completeOwnershipTransfer();

      await upgradedEthBank.connect(addr).register();
      await upgradedEthBank.connect(owner).transfer(addr.address, ethers.utils.parseEther("0.5"));
      await expect(await upgradedEthBank.connect(owner).getBalance()).to.equal(ethers.utils.parseEther("0.5"));
      await expect(await upgradedEthBank.connect(addr).getBalance()).to.equal(ethers.utils.parseEther("0.5"));
  });
});
