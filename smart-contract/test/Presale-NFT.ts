import { ethers, network } from 'hardhat';
import { expect } from "chai";
import { Signer } from "ethers";
import { SneakyVampireSyndicate } from '../types/SneakyVampireSyndicate';
import { SneakyVampireSyndicate__factory } from '../types/factories/SneakyVampireSyndicate__factory';
import { expandTo18Decimals } from '../utils/utilities';

describe("NFT Presale", function () {
  let NFT: SneakyVampireSyndicate | undefined;
  let whitelistUser1: Signer | undefined;
  let whitelistUser2: Signer | undefined;
  let artist: Signer | undefined;

  beforeEach(async () => {
    try {
      [whitelistUser1, whitelistUser2, artist] = await ethers.getSigners();
      //     method: "hardhat_impersonateAccount",
      //     params: [WHALE_ADDRESS],
      // });

      const cid = "QmVU8i23TV6MXvt3cuu9voRZVHS9SvkhW7rgsNVUJGBEuM";
      const defaultBaseURI = `https://ipfs.io/ipfs/${cid}/`;

      NFT = await new SneakyVampireSyndicate__factory(whitelistUser1).deploy(defaultBaseURI);
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
        
        await NFT.addToPresaleList(
          [
          whitelistAddress1,
          whitelistAddress2
          ],
          [
            8,
            9
          ]
        );

        await NFT.togglePresaleStatus();

        await NFT.connect(whitelistUser2).presaleBuy(5, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 5; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }
      }
    });

    it("Whitelist able to buy NFT if it not exceeds", async () => {
      if (whitelistUser1 && whitelistUser2 && NFT) {
        const whitelistAddress1 = await whitelistUser1.getAddress();
        const whitelistAddress2 = await whitelistUser2.getAddress();
        
        await NFT.addToPresaleList(
          [
          whitelistAddress1,
          whitelistAddress2
          ],
          [
            8,
            9
          ]
        );

        await NFT.togglePresaleStatus();

        await NFT.connect(whitelistUser2).presaleBuy(5, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 5; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        await NFT.connect(whitelistUser2).presaleBuy(4, { value: expandTo18Decimals(1) });
     
        for (let i = 6; i <= 9; i++) {
          const ownerOf = await NFT.ownerOf(i);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        await NFT.connect(whitelistUser1).presaleBuy(8, { value: expandTo18Decimals(1) });
      }
    });

    it("Whitelist not able to buy exceeds maximum NFT through first round", async () => {
      if (whitelistUser1 && whitelistUser2 && NFT) {
        const whitelistAddress1 = await whitelistUser1.getAddress();
        const whitelistAddress2 = await whitelistUser2.getAddress();
        
        await NFT.addToPresaleList(
          [
          whitelistAddress1,
          whitelistAddress2
          ],
          [
            8,
            9
          ]
        );

        await NFT.togglePresaleStatus();

        await NFT.connect(whitelistUser2).presaleBuy(5, { value: expandTo18Decimals(1) });

        for (let i = 0; i < 5; i++) {
          const ownerOf = await NFT.ownerOf(i + 1);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        await expect(NFT.connect(whitelistUser2).presaleBuy(5, { value: expandTo18Decimals(1) })).to.be.revertedWith("You can not mint exceeds maximum NFT");
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

        await NFT.connect(whitelistUser2).buy(3, { value: expandTo18Decimals(1) });
        
        for (let i = 3; i <= 5; i++) {
          const ownerOf = await NFT.ownerOf(i);
          expect(ownerOf).to.be.equals(whitelistAddress2);
        }

        await expect(NFT.connect(whitelistUser2).buy(1, { value: expandTo18Decimals(1) })).to.be.revertedWith("You can not mint exceeds maximum NFT");
      }
    });
  });
});