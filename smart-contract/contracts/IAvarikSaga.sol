// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAvarikSaga {
    function buy(uint256 tokenQuantity) external payable;
    function presaleBuy(uint256 tokenQuantity) external payable;
    function addToPresaleList(address[] calldata entries, uint[] calldata maxAmounts) external;
}