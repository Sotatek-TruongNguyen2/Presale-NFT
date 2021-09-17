I. Prerequisite.
    + You must equip yourself with knowledge about "IPFS" and "hardhat". These are very important tools that will help you in uploading metadata and deploying contract. 
    
    + Firstly, you need to download these tools by following the links below: 
        + https://docs.ipfs.io/install/ (For IPFS)
        + https://hardhat.org/tutorial/setting-up-the-environment.html (For hardhat)

    + Secondly, If you don't know about these tools, please go through the guild below and try to understand about these concepts at least:
        + https://docs.ipfs.io/how-to/command-line-quick-start/
        + https://hardhat.org/getting-started/#quick-start

    + Moreover, After cloning project from github, run "npm install" or "npm i" to make sure all packages will be installed on your local environment. 

II. Business logic.
    1. UPLOAD FAKE NFT METADATA TO IPFS
        + Step 1: You need to ensure IPFS is already installed in OS.
        + Step 2: Run IPFS daemon by using command: ipfs daemon.
        + Step 3: As you see, i prepared renderMetadata.js that helps you render fake metadata file to upload. You can run it by using node command or scripts that i listed in package.json.
        + Step 4: Upload to IPFS. Using command meta:upload. So all you need is replace cid variable inside smart-contract/deploy/AvarikSage.ts with cid of folder metadata when uploading is finished.

    2. REVEAL REAL METADATA TO IPFS
        + Step 1: You need to upload images to IPFS then get cids of all images. Then save them to a file.
        + Step 2: Replace image field in metadata with corresponding image cid.
        + Step 3: Re-upload to IPFS then get cid of folder metadata and owner can call smart contract function "setBaseURI" with cid: https://ipfs.io/ipfs/${cid}/

    3. DEPLOY SMART CONTRACT
        + Step 1: in .env file replace DEPLOYER_PRIVATE_KEY with your private key.
        + Step 2: Make sure change cid in deploy/AvarikSage.ts with the latest cid that you have when uploaded metatdata to IPFS.
        + Step 3: Using npm run rinkeby:deploy to deploy contract to rinkeby for testing purpose. If you need to deploy to mainnet, you need to config network in hardhat.config.ts.
        + Step 4: Using npm run rinkeby:verify to verify contract source code or npx harhat verify command.

4. Demo Frontend Features. For instance, buy presale NFT, toggle presale status, set baseURI when presale is ended, add to whitelist, etc
    + query information in smart contract includes presale item price, presale status, tokenID metadata
    + In this demo, i using ethers.js for interacting with smart contract. you can use web3 instead
