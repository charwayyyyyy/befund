// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BeFundCampaign is ReentrancyGuard {
    address public immutable creator;
    address public immutable treasury;

    uint256 public immutable goal;
    uint256 public immutable deadline;

    uint256 public totalRaised;
    bool public withdrawn;
    string public metadataURI;

    mapping(address => uint256) private donorAmounts;
    address[] private donors;

    event DonationReceived(address indexed donor, uint256 amount);
    event FundsWithdrawn(address indexed creator, uint256 amount);

    constructor(
        address _creator,
        address _treasury,
        uint256 _goal,
        uint256 _deadline,
        string memory _metadataURI
    ) {
        require(_creator != address(0), "invalid creator");
        require(_treasury != address(0), "invalid treasury");
        require(_goal > 0, "goal must be > 0");
        require(_deadline > block.timestamp, "deadline must be future");

        creator = _creator;
        treasury = _treasury;
        goal = _goal;
        deadline = _deadline;
        metadataURI = _metadataURI;
    }

    function donate() external payable nonReentrant {
        require(block.timestamp < deadline, "campaign ended");
        require(msg.value > 0, "no eth sent");

        uint256 amount = msg.value;

        if (donorAmounts[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        donorAmounts[msg.sender] += amount;
        totalRaised += amount;

        emit DonationReceived(msg.sender, amount);
    }

    function withdraw() external nonReentrant {
        require(msg.sender == creator, "only creator");
        require(block.timestamp >= deadline, "before deadline");
        require(!withdrawn, "already withdrawn");
        require(totalRaised >= goal, "goal not reached");

        withdrawn = true;
        uint256 balance = address(this).balance;

        (bool success, ) = payable(creator).call{value: balance}("");
        require(success, "transfer failed");

        emit FundsWithdrawn(creator, balance);
    }

    function getSummary()
        external
        view
        returns (
            address _creator,
            uint256 _goal,
            uint256 _deadline,
            uint256 _totalRaised,
            bool _withdrawn,
            string memory _metadataURI
        )
    {
        return (creator, goal, deadline, totalRaised, withdrawn, metadataURI);
    }

    function getDonors() external view returns (address[] memory, uint256[] memory) {
        uint256 length = donors.length;
        uint256[] memory amounts = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            amounts[i] = donorAmounts[donors[i]];
        }
        return (donors, amounts);
    }
}

