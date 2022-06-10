//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "hardhat/console.sol";

contract EthBankV3 is Initializable {
    mapping(address => uint256) private _balances;
    mapping(address => bool) _registered;
    address private _owner;
    address private _newOwner;

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

    modifier safeOwnership {
        require(_newOwner == address(0), "Ownership is changing now");
        _;
    }

    function register() external safeOwnership {
        _registered[msg.sender] = true;
    }

    function deposit(uint256 amount) external payable onlyRegisteredAccount safeOwnership {
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

    function transfer(address to, uint256 amount) external onlyRegisteredAccount safeOwnership {
        require(amount <= _balances[msg.sender], "Not enough ETH in the bank");
        if(_registered[to]) {
            _balances[to] += amount;
            _balances[msg.sender] -= amount;
        } else {
            _balances[msg.sender] -= amount;
            payable(to).transfer(amount);
        }
    }

    function startOwnershipTransfer(address newAddr) external onlyOwner {
        require(newAddr != address(0), "You can't transfer the ownership to zero address");
        _newOwner = newAddr;
    }

    function cancelOwnershipTransfer() external onlyOwner {
        _newOwner = address(0);
    }

    function completeOwnershipTransfer() external onlyOwner {
        _owner = _newOwner;
        _newOwner = address(0);
    }
}