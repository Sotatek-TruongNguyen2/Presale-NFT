import { ethers, network } from 'hardhat';
import { expect } from "chai";
import { Signer } from "ethers";
import { AvarikSaga } from '../types/AvarikSaga';
import { AvarikSaga__factory } from '../types/factories/AvarikSaga__factory';
import { expandTo18Decimals } from '../utils/utilities';

describe("NFT Presale", function () {
  let NFT: AvarikSaga;
  let whitelistUser1: Signer;
  let whitelistUser2: Signer;
  let artist: Signer;
  let signer: Signer;

  beforeEach(async () => {
    try {
      [whitelistUser1, whitelistUser2, artist, signer] = await ethers.getSigners();

      const cid = "QmVU8i23TV6MXvt3cuu9voRZVHS9SvkhW7rgsNVUJGBEuM";
      const defaultBaseURI = `https://ipfs.io/ipfs/${cid}/`;

      const signerAddress = await signer.getAddress();

      NFT = await new AvarikSaga__factory(whitelistUser1).deploy(defaultBaseURI, signerAddress);
      console.log("NFT: " + NFT.address);
    } catch(err: any) {
      console.log(err.message);
    }
  });

  describe("Presale First Round", async () => {
    it("Whitelist able to buy NFT through first round", async () => {
      if (whitelistUser1 && whitelistUser2 && NFT) {
        const whitelistAddress1 = await whitelistUser1.getAddress();
        const whitelistAddress2 = await whitelistUser2.getAddress();

        await NFT.togglePresaleStatus();

        const chainId = await network.provider.request({
          method: "eth_chainId"
        });

        const signature = await (signer as any)._signTypedData(
          // Domain
          {
            name: 'Avarik Saga',
            version: '1.0.0',
            chainId,
            verifyingContract: NFT.address,
          },
          {
              Presale: [
                  { name: 'buyer', type: 'address' },
                  { name: 'maxCount', type: 'uint256' }
              ]
          },
          { buyer: whitelistAddress1, maxCount: 5 },
        );

        await NFT.connect(whitelistUser1).presaleBuy(2, 5, signature, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 2; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress1);
        }
      }
    });

    it("Whitelist able to buy NFT if it not exceeds", async () => {
      if (whitelistUser1 && whitelistUser2 && NFT) {
        const whitelistAddress1 = await whitelistUser1.getAddress();
        const whitelistAddress2 = await whitelistUser2.getAddress();
        
        const chainId = await network.provider.request({
          method: "eth_chainId"
        });

        const signature = await (signer as any)._signTypedData(
          // Domain
          {
            name: 'Avarik Saga',
            version: '1.0.0',
            chainId,
            verifyingContract: NFT.address,
          },
          {
              Presale: [
                  { name: 'buyer', type: 'address' },
                  { name: 'maxCount', type: 'uint256' }
              ]
          },
          { buyer: whitelistAddress1, maxCount: 5 },
        );

        await NFT.togglePresaleStatus();

        await NFT.connect(whitelistUser1).presaleBuy(2, 5, signature, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 2; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress1);
        }

        await NFT.connect(whitelistUser1).presaleBuy(3, 5, signature, { value: expandTo18Decimals(1) });
      
        for (let i = 2; i < 5; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress1);
        }
      }
    });

    it("Whitelist not able to buy exceeds maximum NFT through first round", async () => {
      if (whitelistUser1 && whitelistUser2 && NFT) {
        const whitelistAddress1 = await whitelistUser1.getAddress();
        const whitelistAddress2 = await whitelistUser2.getAddress();
        
        const chainId = await network.provider.request({
          method: "eth_chainId"
        });

        const signature = await (signer as any)._signTypedData(
          // Domain
          {
            name: 'Avarik Saga',
            version: '1.0.0',
            chainId,
            verifyingContract: NFT.address,
          },
          {
              Presale: [
                  { name: 'buyer', type: 'address' },
                  { name: 'maxCount', type: 'uint256' }
              ]
          },
          { buyer: whitelistAddress1, maxCount: 5 },
        );

        await NFT.togglePresaleStatus();

        await NFT.connect(whitelistUser1).presaleBuy(3, 5, signature, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 3; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress1);
        }

        await expect(NFT.connect(whitelistUser1).presaleBuy(5, 5, signature, { value: expandTo18Decimals(1) })).to.be.revertedWith("You can not mint exceeds maximum NFT");
      }
    });
  });

  describe("Presale Second Round", async () => {
    it("All users able to mint NFT if it not exceeds 5", async () => {
      if (whitelistUser1 && whitelistUser2 && NFT) {
        const whitelistAddress1 = await whitelistUser1.getAddress();
        const whitelistAddress2 = await whitelistUser2.getAddress();

        await NFT.toggleSaleStatus();

        await NFT.connect(whitelistUser2).buy(2, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 2; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        await network.provider.send("evm_increaseTime", [800]);

        await NFT.connect(whitelistUser2).buy(3, { value: expandTo18Decimals(1) });
        
        for (let i = 3; i <= 5; i++) {
          const ownerOf = await NFT.ownerOf(i);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }
      }
    });

    it("All users not able to mint NFT if it exceeds 5", async () => {
      if (whitelistUser1 && whitelistUser2 && NFT) {
        const whitelistAddress1 = await whitelistUser1.getAddress();
        const whitelistAddress2 = await whitelistUser2.getAddress();

        await NFT.toggleSaleStatus();

        await NFT.connect(whitelistUser2).buy(2, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 2; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        await network.provider.send("evm_increaseTime", [800]);

        await NFT.connect(whitelistUser2).buy(3, { value: expandTo18Decimals(1) });
        
        for (let i = 3; i <= 5; i++) {
          const ownerOf = await NFT.ownerOf(i);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        const tokenID = await NFT.tokenURI("1");

        console.log(tokenID);

        await network.provider.send("evm_increaseTime", [800]);

        await expect(NFT.connect(whitelistUser2).buy(1, { value: expandTo18Decimals(1) })).to.be.revertedWith("You can not mint exceeds maximum NFT");
      }
    });

    it("All users not able to mint NFT until freeze time is ended", async () => {
      if (whitelistUser1 && whitelistUser2 && NFT) {
        const whitelistAddress1 = await whitelistUser1.getAddress();
        const whitelistAddress2 = await whitelistUser2.getAddress();

        await NFT.toggleSaleStatus();

        await NFT.connect(whitelistUser2).buy(2, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 2; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        await network.provider.send("evm_increaseTime", [800]);

        await NFT.connect(whitelistUser2).buy(3, { value: expandTo18Decimals(1) });
        
        for (let i = 3; i <= 5; i++) {
          const ownerOf = await NFT.ownerOf(i);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        const tokenID = await NFT.tokenURI("1");

        console.log(tokenID);

        await expect(NFT.connect(whitelistUser2).buy(1, { value: expandTo18Decimals(1) })).to.be.revertedWith("Not allow to purchase in freeze time!");
      }
    });
  })
});