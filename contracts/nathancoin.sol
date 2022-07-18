// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract NathanCoin {
    string public constant name = "Nathan Coin";
    string public constant symbol = "NATC";
    uint8 public constant decimals = 18;
    uint256 public totalSupply = 1000000;
    address public owner;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    //Mapping to be able to store the balances of the different accounts
    mapping(address => uint256) public balances;

    mapping(address => mapping(address => uint256)) public allowed;

    //Constructor
    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    //Getter for the balance of an account
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    //transfer token to a account
    function transfer(address to, uint256 value) public returns (bool) {
        require(value <= balances[msg.sender], "Insufficient funds");

        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    //approve another account to spend the tokens of this account
    function approve(address spender, uint256 value) public returns (bool) {
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    //get the allowance status of an account
    function getAllowance(address owner_, address spender)
        public
        view
        returns (uint256)
    {
        return allowed[owner_][spender];
    }

    //transfer from an account to another account
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool) {
        require(value <= balances[from], "Insufficient funds");
        require(value <= allowed[from][msg.sender], "Insufficient allowance");

        balances[from] -= value;
        allowed[from][msg.sender] -= value;
        balances[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}
