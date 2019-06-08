pragma solidity ^0.5.8;

contract BlockchainSplitwise {
    
    // debts[to][from]
    mapping(address => mapping (address => uint32)) public debts;

    function lookup(address debtor, address creditor) public view returns (uint32 ret) {
        ret = debts[creditor][debtor];
    }

    function add_IOU(address creditor, uint32 amount) public {
        require(amount > 0);

        address from = creditor;
        address to = msg.sender;
        // There is an existing deb (to -> from that exceeds the new debt (from -> to)
        if (debts[to][from] > amount) {
            debts[to][from] -= amount;

            // The new debt (from -> to) is equal to the existing debt
        } else if (debts[to][from] == amount) {
            debts[to][from] = 0;
            // The new debt (from -> to) exeeds the existing debt (to -> from)
        } else {
            amount -= debts[to][from];
            debts[to][from] = 0;
            debts[from][to] += amount;
        }
    }
}
