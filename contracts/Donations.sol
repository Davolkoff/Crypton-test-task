//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Donations {
    
    struct Donation{ // тип данных для пожертвований
        uint amount; // количество пожертвованных денег
        address sender; // отправитель
    } 

    address owner; // адрес владельца контракта
    Donation[] donations; // массив с информацией о пожертвованиях
    
    bool user_exists_in_base = false; // создание булевой функции для проверки, есть ли пользователь в массиве

    constructor() { // конструктор для контракта
        owner = msg.sender;
    }

    modifier requireOwner() { // проверка, является ли человек, вызывющий функцию, владельцем контракта
        require(owner == msg.sender, "Not an owner");
        _;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function withdrawTo(address payable _to, uint amount) public requireOwner { // функция для вывода средств с проверкой на владельца
        _to.transfer(amount);
    }

    function totalDonations(address _user) public view returns(uint) {
        uint amount;
        for (uint64 i; i < donations.length; i++) {
            if (donations[i].sender == _user) {
                amount = donations[i].amount;
            }
            
        
        }
        return amount;
    }

    function getDonaters() public view returns (address [] memory) { // функция, выводящая людей, пожертвовавших деньги и опционально сумм пожертвований
        address[] memory donaters = new address[] (donations.length); // массив с информацией о пожертвовавших людях
        for (uint64 i; i < donations.length; i++) {
            donaters[i] = donations[i].sender;
        }
        return donaters;
    }

    receive() external payable{ // функция перевода денег в контракт
        Donation memory newDonation = Donation(msg.value, msg.sender);

        for (uint64 i; i < donations.length; i++){ // проверка, есть ли пользователь в массиве
            if (donations[i].sender == msg.sender){
                donations[i].amount += msg.value;
                user_exists_in_base = true;
            }
            
        }

        if (!user_exists_in_base){ // если пользователь не найден, добавляется новая ячейка в массив
            donations.push(newDonation);
        }

        user_exists_in_base = false; // возврат к нулю для дальнейших операций
    }

    
}