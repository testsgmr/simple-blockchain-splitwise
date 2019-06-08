const BlockchainSplitwise = artifacts.require("BlockchainSplitwise")

contract('BlockchainSplitwise', (accounts) => {
	const ALICE = accounts[1];
    const BOB = accounts[2];
    const ALI = accounts[3];
    const SHABNAM = accounts[4];
    const ARYAN = accounts[5];
    const TORAB = accounts[6];
    const SHEKAR = accounts[7];

	it("should verify bob and alice's debets default to 0", async () => {
		const bsw = await BlockchainSplitwise.deployed()
		const bobNum = await bsw.lookup(ALICE, BOB)
		assert.equal(bobNum.toNumber(), 0, "bob's default value was non-zero")
	})

	it("should verify bob and alice's debets default to 1000", async () => {
		const bsw = await BlockchainSplitwise.deployed()
		await bsw.add_IOU(BOB, 1000, {from: ALICE});
		const aliceNum = await bsw.lookup(ALICE, BOB)
		assert.equal(aliceNum.toNumber(), 1000, "alice's debets value must be 1000")
	})

	it("should verify shabnam -(1000)-> ali & ali -(1000)-> shabnam == {(shabnam-->ali) = 0}", async () => {
		const bsw = await BlockchainSplitwise.deployed()
		await bsw.add_IOU(SHABNAM, 1000, {from: ALI});
		await bsw.add_IOU(ALI, 1000, {from: SHABNAM});
		const aliNum = await bsw.lookup(ALI, SHABNAM)
		assert.equal(aliNum.toNumber(), 0, "ALI's debets value must be 0")
		const shabNum = await bsw.lookup(SHABNAM, ALI)
		assert.equal(shabNum.toNumber(), 0, "SHABNAM's debets value must be 0")
	})

	it("should verify shabnam -(1000)-> ali & ali -(500)-> shabnam == {(shabnam-->ali) = 500}", async () => {
		const bsw = await BlockchainSplitwise.deployed()
		await bsw.add_IOU(SHABNAM, 1000, {from: ALI});
		await bsw.add_IOU(ALI, 500, {from: SHABNAM});
		const aliNum = await bsw.lookup(ALI, SHABNAM)
		assert.equal(aliNum.toNumber(), 500, "ALI's debets value must be 0")
		const shabNum = await bsw.lookup(SHABNAM, ALI)
		assert.equal(shabNum.toNumber(), 0, "SHABNAM's debets value must be 0")
	})

	it("should verify aryan -(1000)-> shekar & aryan -(500)-> torab & torab -(1000)-> shekar}", async () => {
		const bsw = await BlockchainSplitwise.deployed()
		await bsw.add_IOU(ARYAN, 1000, {from: TORAB});
		await bsw.add_IOU(TORAB, 1000, {from: SHEKAR});
		await bsw.add_IOU(ARYAN, 500, {from: SHEKAR});
		const torabNum = await bsw.lookup(TORAB, ARYAN)
		assert.equal(torabNum.toNumber(), 1000, "torab must 1000 debets to aryan")
		const shekarNum = await bsw.lookup(SHEKAR, ARYAN)
		assert.equal(shekarNum.toNumber(), 500, "shekar must 500 debets to aryan")
		const shekarNum2 = await bsw.lookup(SHEKAR, TORAB)
		assert.equal(shekarNum2.toNumber(), 1000, "shekar must 1000 debets to torab")
	})
})
