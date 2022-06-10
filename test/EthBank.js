const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EthBank", function() {
  let EthBank;
  let deployedEthBank;
  let owner;

  beforeEach(async function() {
    [owner] = await ethers.getSigners();

    EthBank = await ethers.getContractFactory("EthBank");
    deployedEthBank = await EthBank.deploy();
    await deployedEthBank.deployed();
  })

  it("Can't deposit ETH before registration", async function () {
    await expect(deployedEthBank.deposit(10000, {value: 10000})).to.be.revertedWith("Please register first");
  });

  it("Can deposit ETH after registration", async function () {
    await deployedEthBank.register();
    await deployedEthBank.deposit(10000, {value: 10000});
    await expect(await deployedEthBank.getBalance()).to.equal(10000);
  })

  it("Can Witdraw from the bank", async function () {
    await deployedEthBank.register();
    await deployedEthBank.deposit(10000, {value: 10000});
    await deployedEthBank.withdraw(5000);
    await expect(await deployedEthBank.getBalance()).to.equal(5000);
  })

  it("Can't Witdraw bigger amount than balance", async function () {
    await deployedEthBank.register();
    await deployedEthBank.deposit(10000, {value: 10000});
    await expect(deployedEthBank.withdraw(20000)).to.be.revertedWith("Not enough ETH in the bank");
  })
});
