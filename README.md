## Prerequisite
1. You must equip yourself with knowledge about "IPFS" and "hardhat". These are very important tools that will help you in uploading metadata and deploying contract. 
    
2. Firstly, you need to download these tools by following the links below: 
    + https://docs.ipfs.io/install/ (For IPFS)
    + For hardhat, I already listed it in package.json file, so you don't need to download it again.

3. Secondly, If you don't know about these tools, please walk through the guild below and try to understand about these concepts at least:
    + https://docs.ipfs.io/how-to/command-line-quick-start/
    + https://hardhat.org/getting-started/#quick-start

4. Thirdly, Ethers.js or web3.js which are pretty nice tools to have (but not required). These will be used in front-end demo for stimulating interaction between our application with blockchain. If you want to know about Ethers.js or Web3, you can walk through the links below:
    + https://docs.ethers.io/v5/
    + https://web3js.readthedocs.io/en/v1.5.2/

5. Moreover, After cloning project from github, run "npm install" or "npm i" to make sure all packages will be installed on your local environment. 

## DEPLOYMENT
### IPFS
1. UPLOAD FAKE NFT METADATA TO IPFS
    + Step 1: Download IPFS onto your computer and you need to ensure IPFS is already installed in OS. But if you don't know how to download and install IPFS, please try to walk through this links and follow all steps: https://docs.ipfs.io/install/
    + Step 2: When IPFS is already installed, run IPFS daemon by using command: ipfs daemon.
    + Step 3: As you see, I prepared renderMetadata.js that helps you render fake metadata file to upload. You can run it by using node command or scripts that i listed in package.json.
    + Step 4: Upload to IPFS. Using command meta:upload. So all you need is replace cid variable inside smart-contract/deploy/AvarikSage.ts with cid of folder metadata when uploading is finished.

2. REVEAL REAL METADATA TO IPFS
    + Step 1: You need to upload images to IPFS then get cids of all images. Then save them to a file.
    + Step 2: Replace image field in metadata with corresponding image cid.
    + Step 3: Re-upload to IPFS then get cid of folder metadata and owner can call smart contract function "setBaseURI" with cid: https://ipfs.io/ipfs/${cid}/

### DEPLOY SMART CONTRACT
+ Step 1: Make sure hardhat is already installed in this project by running "npx hardhat --version" inside smart-contract folder.If It not installed yet, you need to run "npm install --save hardhat" to install it.
+ Step 2: in .env file replace DEPLOYER_PRIVATE_KEY with your private key.
+ Step 3: Make sure change cid in deploy/AvarikSage.ts with the latest cid that you have when uploaded metatdata to IPFS.
+ Step 4: To deploy smart contracts to other Ethereum networks: 
    - Testnet (Rinkeby): Using "npm run rinkeby:deploy" command.
    - Mainnet (Ethereum): Using "npm run mainnet:deploy" command instead.
+ Step 5: To verify smart contracts to other Ethereum networks:  
    - Testnet (Rinkeby): Using "npm run rinkeby:verify" command.
    - Mainnet (Ethereum): Using "npm run mainnet:verify" command instead.
    - Another option is using "npx hardhat verify" command of hardhat instead of my scripts. Referral link: https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html