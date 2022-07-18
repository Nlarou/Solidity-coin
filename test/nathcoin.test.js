const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
describe("nathancoin", () => {
  async function deployTokenFixture() {
    const nathcoin = await ethers.getContractFactory("NathanCoin");
    const [owner, nathAddress, bobAddress] = await ethers.getSigners();
    const nathcoinInstance = await nathcoin.deploy();
    await nathcoinInstance.deployed();
    return { nathcoin, nathcoinInstance, owner, nathAddress, bobAddress };
  }
  it("Should assign the total supply of tokens to the owner", async function () {
    const { nathcoinInstance, owner } = await loadFixture(deployTokenFixture);

    const ownerBalance = await nathcoinInstance.balanceOf(owner.address);
    expect(await nathcoinInstance.totalSupply()).to.equal(ownerBalance);
  });
  it("Should transfer tokens between accounts", async function () {
    const { nathcoinInstance, owner, nathAddress, bobAddress } =
      await loadFixture(deployTokenFixture);

    await expect(
      nathcoinInstance.transfer(nathAddress.address, 50)
    ).to.changeTokenBalances(nathcoinInstance, [owner, nathAddress], [-50, 50]);

    // Transfer 50 tokens from addr1 to addr2
    // We use .connect(signer) to send a transaction from another account
    await expect(
      nathcoinInstance.connect(nathAddress).transfer(bobAddress.address, 50)
    ).to.changeTokenBalances(
      nathcoinInstance,
      [nathAddress, bobAddress],
      [-50, 50]
    );
  });
  it("Should fail if sender doesn't have enough tokens", async function () {
    const { nathcoinInstance, owner, nathAddress } = await loadFixture(
      deployTokenFixture
    );
    const initialOwnerBalance = await nathcoinInstance.balanceOf(owner.address);

    // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(
      nathcoinInstance.connect(nathAddress).transfer(owner.address, 1)
    ).to.be.revertedWith("Not enough tokens");

    // Owner balance shouldn't have changed.
    expect(await nathcoinInstance.balanceOf(owner.address)).to.equal(
      initialOwnerBalance
    );
  });
});
