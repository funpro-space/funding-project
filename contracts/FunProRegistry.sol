// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FunProRegistry {
    event BudgetLogged(address indexed founder, string ipfsHash, uint256 totalUSDC);
    
    mapping(address => string) public founderBudgets;

    function logBudget(string calldata _ipfsHash, uint256 _totalUSDC) external {
        founderBudgets[msg.sender] = _ipfsHash;
        emit BudgetLogged(msg.sender, _ipfsHash, _totalUSDC);
    }
}
