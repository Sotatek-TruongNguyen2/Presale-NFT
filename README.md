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

4. ATTENTIONS FOR DEPLOYING CONTRACT TO MAINNET
    + State Variables (You guys can change the below variables to make contract fit for purpose)
        - AVARIK_GIFT: Total Amounts of NFTs for gifting. (Only owner can do gifting).
        - AVARIK_PRIVATE: Total Amounts of NFTs for PreSale.
        - AVARIK_PUBLIC: Total Amounts of NFTs for Public Sale.
        - AVARIK_PRICE: Price of single NFT.
        - AVARIK_PER_MINT: Max NFTs per transaction can be minted in Public Sale.
        - AVARIK_PUBLIC_PER_SALER: Max NFTs that one person can purchase in Public Sale.
        - _artistAddress: This address will receive 2/5 raising amounts when owner withdraw it.

    + Functions:
        -   function addToPresaleList(address[] calldata entries, uint[] calldata maxAmounts) external onlyOwner;
            * Add Whitelisted users to Presale list with corresponding max amounts.
            * Params: 
                + entries: Addresses of whitelisted users.
                + maxAmounts: Maximum amount of NFT can be bought by each Whitelisted users.

        -   function removeFromPresaleList(address[] calldata entries) external onlyOwner;
            * Remove Whitelisted users From Presale list.
            * Params: 
                + entries: Addresses of whitelisted users

        -   function buy(uint256 tokenQuantity) external payable;
            * Purchase NFT in public sale.
            * Params: 
                + tokenQuantity: Amounts of NFT that user want to buy.

        -   function presaleBuy(uint256 tokenQuantity) external payable;
            * Purchase NFT in PreSale.
            * Params: 
                + tokenQuantity: Amounts of NFT that user want to buy.

        -   function gift(address[] calldata receivers) external onlyOwner;
            * Gifting NFT to other users
            * Params: 
                + receivers: addresses of receivers

        -   function withdraw() external onlyOwner;
            * Owner can withdraw raising amounts

        -   function togglePresaleStatus() external;
            * Turn On/Off Presale Round

        -   function toggleSaleStatus() external;
            * Turn On/Off Public Sale Round

        -   function setBaseURI(string calldata URI) external onlyOwner;
            * Update Base URI when revealing real metadata
            * Params:
                + URI: https://ipfs.io/ipfs/${cid}/


    + ** NOTES **  Make sure public sale and presale status can't be "ON" at the same time. For instance, if you want to active Presale, you must turn off Public Sale and turn on Presale, and vice versa.

4. Demo Frontend Features. For instance, buy presale NFT, toggle presale status, set baseURI when presale is ended, add to whitelist, etc
    + query information in smart contract includes presale item price, presale status, tokenID metadata
    + In this demo, i using ethers.js for interacting with smart contract. you can use web3 instead

5. Rinkeby Contract Addresses for testing purpose
    + NFT: 0x2a66D89c08E6DA9E824dCB0c9326dc383a065BE6
    + BuyPresale txs:
        - https://rinkeby.etherscan.io/tx/0xfbca5d969942d0fbeb176db62084797f3e202fe2ed5ea7877ffbf94646e86202
        - https://rinkeby.etherscan.io/tx/0xb2e09634fafcf16ea956ac5e6a4befdb5afec9a4a7049157d2d560c2e7583ead
        - https://rinkeby.etherscan.io/tx/0x321dce8ed140011ea7a3e99965620db2238f7e0f7cb445baa6ae4dc60a45004b

6. EXPLAIN SCRIPTS IN PACKAGE.JSON
    + meta:fake:render => Prepare Unrevealed metadata for uploading to IPFS.
    + meta:upload => Upload Unrevealed metadata to IPFS.
    + meta:reveal:render =>  Upload Reveal metadata to IPFS.
    + image:upload => Upload Images to IPFS for Reveal Metadata.

7. EXPLAIN SCRIPTS IN SMART-CONTRACT FOLDER
    + add:whitelist => Run Scripts for batch whitelisting.
    + bsc:deploy => Deploy smart contract to BSC testnet.
    + rinkeby:deploy => Deploy smart contract to Rinkeby testnet.
    + rinkeby:verify => Verify smart contract on Rinkeby testnet.


8. NOTES WHEN EXECUTING BATCH WHITELISTING:
    - In smart-contract folder, i prepare whitelist.json file inside settings folder. You guys can check it out and fill it with your whitelisted users. It's a json object with key is whitelisted user's address and value is maximum NFT that user can buy in presale round.
    - After that, You can execute add:whitelist script to execute addToPresaleList function in smart contract. 
    - In .env file, you must change the below variables:
        + NETWORK: switch to "mainnet" if you want to deploy to ethereum mainnet.
        + AVARIK_ADDRESS: Address of NFT on ethereum mainnet.
        + DEPLOYER_PRIVATE_KEY: Private key of Owner NFT contract.
        + INFURA_API_KEY: Infura API key if you have. Otherwise, check out "https://infura.io/" for more information.

9. MAIN FLOWS
    + Presale:
        - Step 1: Inside renderMetadata.js, you guys can go and change metaData object to your desired metaData. NOTES: In the for loop, change "name" property if you want.
        - Step 2: Render fake metadata by using "meta:fake:render" command that i already listed in package.json file.
        - Step 3: Upload Fake metadata to IPFS by using "meta:upload" command.
        - Step 4: Deploy Smart contract with root cid that we got from metadata above.
            + You guys can change the below variables to make contract fit for purpose
            + NOTES: 
                - AVARIK_GIFT: Total Amounts of NFTs for gifting. (Only owner can do gifting).
                - AVARIK_PRIVATE: Total Amounts of NFTs for PreSale.
                - AVARIK_PUBLIC: Total Amounts of NFTs for Public Sale.
                - AVARIK_PRICE: Price of single NFT.
                - AVARIK_PER_MINT: Max NFTs per transaction can be minted in Public Sale.
                - AVARIK_PUBLIC_PER_SALER: Max NFTs that one person can purchase in Public Sale.
                - _artistAddress: This address will receive 2/5 raising amounts when owner withdraw it.
        - Step 5: Add whitelisted users to presale list by using addToPresaleList function on smart contract.
        - Step 6: Call function togglePresaleStatus to start presale round.
        - Step 7: Whitelisted users can go and buy Presale NFT by using presaleBuy function.
    + Sale:
        - Step 1: Call function togglePresaleStatus again to end presale round.
        - Step 2: Call function toggleSaleStatus to start sale round.
        - Step 3: All Users can go and buy NFT by using buy function.
    + Reveal real data:
        - Step 1: Upload images to IPFS by using "image:upload" command. NOTES: Images which will be used for revealing are placed in smart-contract-metadata/assets
        - Step 2: After uploading is finished, you can copy all cids of uploaded images and place them in imageUrl variable inside renderNewMetadata.js.
        - Step 3: Render real metadata by using "meta:reveal:render" command that i already listed in package.json file.
        - Step 4: Upload Real metadata to IPFS when presale round is ended using "meta:reveal:upload" command.
        - Step 5: Call function "setBaseURI" with new cid that we got from above: https://ipfs.io/ipfs/${cid}/.
