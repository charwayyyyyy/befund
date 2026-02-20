// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    uint256 public totalFees;

    event FeeCollected(address indexed campaign, uint256 amount, uint256 fee);
    event TreasuryWithdrawal(address indexed to, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function collectFee(address campaign, uint256 amount) external payable {
        require(msg.value > 0, "no fee sent");
        totalFees += msg.value;
        emit FeeCollected(campaign, amount, msg.value);
    }

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "invalid to");
        require(amount <= address(this).balance, "insufficient balance");
        (bool success, ) = to.call{value: amount}("");
        require(success, "transfer failed");
        emit TreasuryWithdrawal(to, amount);
    }
}

