// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BeFund is ReentrancyGuard {
    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool withdrawn;
    }

    mapping(uint256 => Campaign) private campaigns;
    mapping(uint256 => mapping(address => uint256)) private donations;
    uint256 private nextCampaignId;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    event CampaignWithdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) external returns (uint256) {
        require(_goal > 0, "Goal must be greater than zero");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        uint256 campaignId = nextCampaignId;
        campaigns[campaignId] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            deadline: _deadline,
            amountRaised: 0,
            withdrawn: false
        });

        nextCampaignId += 1;

        emit CampaignCreated(campaignId, msg.sender, _title, _goal, _deadline);

        return campaignId;
    }

    function donate(uint256 _campaignId) external payable nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator != address(0), "Campaign does not exist");
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Must send ETH to donate");

        campaign.amountRaised += msg.value;
        donations[_campaignId][msg.sender] += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    function withdraw(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator != address(0), "Campaign does not exist");
        require(msg.sender == campaign.creator, "Only creator can withdraw");
        require(block.timestamp >= campaign.deadline, "Cannot withdraw before deadline");
        require(campaign.amountRaised >= campaign.goal, "Funding goal not reached");
        require(!campaign.withdrawn, "Already withdrawn");

        campaign.withdrawn = true;
        uint256 amount = campaign.amountRaised;

        (bool success, ) = campaign.creator.call{value: amount}("");
        require(success, "Transfer failed");

        emit CampaignWithdrawn(_campaignId, campaign.creator, amount);
    }

    function getDonations(uint256 _campaignId, address _donor) external view returns (uint256) {
        return donations[_campaignId][_donor];
    }

    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        Campaign memory campaign = campaigns[_campaignId];
        require(campaign.creator != address(0), "Campaign does not exist");
        return campaign;
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory list = new Campaign[](nextCampaignId);
        for (uint256 i = 0; i < nextCampaignId; i++) {
            list[i] = campaigns[i];
        }
        return list;
    }
}
