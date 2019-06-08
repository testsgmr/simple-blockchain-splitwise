var SimpleStorage = artifacts.require("BlockchainSplitwise");

module.exports = function(deployer) {
	deployer.deploy(SimpleStorage);
};