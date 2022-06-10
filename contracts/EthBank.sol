//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract EthBank is Initializable {
    mapping(address => uint256) private _balances;
    mapping(address => bool) _registered;
    address private _owner;

  //  constructor() initializer {}

    function initialize() public initializer {
        _owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == _owner, "You are not my owner");
        _;
    }

    modifier onlyRegisteredAccount {
        require(_registered[msg.sender], "Please register first");
        _;
    }

    function register() external {
        _registered[msg.sender] = true;
    }

    function deposit(uint256 amount) external payable onlyRegisteredAccount {
    //    require(msg.value > 0, "Need to send more than 0 ETH");
        require(msg.value >= amount, "Not enough ETH to deposit");
        _balances[msg.sender] += amount;
    }

    function withdraw(uint256 amount) external onlyRegisteredAccount {
        require(amount <= _balances[msg.sender], "Not enough ETH in the bank");
        _balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getBalance() external view onlyRegisteredAccount returns(uint256) {
        return _balances[msg.sender];
    }
}