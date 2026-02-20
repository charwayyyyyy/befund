// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./BeFundCampaign.sol";

contract BeFundFactory is Initializable, OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    address public treasury;
    address[] private campaigns;

    event CampaignCreated(
        address indexed campaignAddress,
        address indexed creator,
        uint256 goal,
        uint256 deadline,
        string metadataURI
    );

    function initialize(address _treasury) external initializer {
        require(_treasury != address(0), "invalid treasury");
        __Ownable_init(msg.sender);
        __Pausable_init();
        __UUPSUpgradeable_init();
        treasury = _treasury;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function createCampaign(
        uint256 goal,
        uint256 deadline,
        string calldata metadataURI
    ) external whenNotPaused returns (address) {
        BeFundCampaign campaign = new BeFundCampaign(
            msg.sender,
            treasury,
            goal,
            deadline,
            metadataURI
        );
        address campaignAddress = address(campaign);
        campaigns.push(campaignAddress);

        emit CampaignCreated(campaignAddress, msg.sender, goal, deadline, metadataURI);

        return campaignAddress;
    }

    function getCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
}
