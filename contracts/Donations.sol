//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Donations {
    // data type for donations
    struct Donation{ 
        uint amount;
        address sender;
    }
    address owner;

    Donation[] donations; // array with information about donations
    
    bool user_exists_in_base = false; // to check if there is a user in the database

    // contract constructor
    constructor() {
        owner = msg.sender;
    }

    // checks whether the person is the owner of the contract
    modifier requireOwner() {
        require(owner == msg.sender, "Not an owner");
        _;
    }

    // returns address of contract owner
    function getOwner() public view returns (address) {
        return owner;
    }

    // function for withdrawal of funds with verification of the owner
    function withdrawTo(address payable _to, uint amount) public requireOwner { 
        _to.transfer(amount);
    }

    // returns the amount of donations of a certain user
    function totalDonations(address _user) public view returns(uint) { 
        uint amount;
        for (uint64 i; i < donations.length; i++) {
            if (donations[i].sender == _user) {
                amount = donations[i].amount;
            } 
        }
        return amount;
    }

    // function that displays people who donated money
    function getDonaters() public view returns (address [] memory) {
        address[] memory donaters = new address[] (donations.length);
        for (uint64 i; i < donations.length; i++) {
            donaters[i] = donations[i].sender;
        }
        return donaters;
    }

    // the function of transferring money to the contract
    receive() external payable{ 
        Donation memory newDonation = Donation(msg.value, msg.sender);

        for (uint64 i; i < donations.length; i++){ // checking if there is a user in the array
            if (donations[i].sender == msg.sender){
                donations[i].amount += msg.value;
                user_exists_in_base = true;
            }
            
        }

        if (!user_exists_in_base){ // if the user is not found, a new cell in the array is added
            donations.push(newDonation);
        }

        user_exists_in_base = false; // return to zero for further operations
    }

    
}