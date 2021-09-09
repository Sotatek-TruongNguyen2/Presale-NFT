require('dotenv').config();

const ethers = require('ethers');
const whitelist = require('../settings/Whitelist.json');
const NFTABI = require('../abi/AvarikSaga.json');

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const NFT_ADDRESS = process.env.AVARIK_ADDRESS;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const NETWORK = process.env.NETWORK;

const main = async () => {
    const provider = new ethers.providers.InfuraProvider(NETWORK, INFURA_API_KEY)
    const wallet = new ethers.Wallet(`${DEPLOYER_PRIVATE_KEY}`, provider);

    const whitelistAddresses = [];
    const whitelistMaxAmounts = [];

    Object.entries(whitelist).map(([address, maxAmount]) => {
        whitelistAddresses.push(address);
        whitelistMaxAmounts.push(maxAmount);
    });

    const contract = new ethers.Contract(NFT_ADDRESS, NFTABI, wallet);

    const tx = await contract.addToPresaleList(
        whitelistAddresses,
        whitelistMaxAmounts
    ) 

    console.log("TX HASH: " + tx.hash);

    await tx.wait(1);

    console.log("DONE");
}

main();