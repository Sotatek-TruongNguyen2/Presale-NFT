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

