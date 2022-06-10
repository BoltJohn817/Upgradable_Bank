const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("EthBank", function() {
  let EthBank;
  let deployedEthBank;
  let owner;

  beforeEach(async function() {
    [owner] = await ethers.getSigners();

    EthBank = await ethers.getContractFactory('EthBank');
    deployedEthBank = await upgrades.deployProxy(EthBank, { initializer: 'initialize' });
    await deployedEthBank.deployed();
  })

  it("Can't deposit ETH before registration", async function () {
    await expect(deployedEthBank.deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")})).to.be.revertedWith("Please register first");
  });

  it("Can deposit ETH after registration", async function () {
    await deployedEthBank.register();
    await deployedEthBank.deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")});
    await expect(await deployedEthBank.getBalance()).to.equal(ethers.utils.parseEther("1"));
  })

  it("Can Witdraw from the bank", async function () {
    await deployedEthBank.register();
    await deployedEthBank.deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")});
    await deployedEthBank.withdraw(ethers.utils.parseEther("0.5"));
    await expect(await deployedEthBank.getBalance()).to.equal(ethers.utils.parseEther("0.5"));
  })

  it("Can't Witdraw bigger amount than balance", async function () {
    await deployedEthBank.register();
    await deployedEthBank.deposit(ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("1")});
    await expect(deployedEthBank.withdraw(ethers.utils.parseEther("2"))).to.be.revertedWith("Not enough ETH in the bank");
  })
});
