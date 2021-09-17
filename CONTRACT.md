- This file is all about the explanation of all functions, variables, commands that i used in smart contract. Moreover, I added some notes in the bottom about batch whitelisting in Presale round too. 

## COMMANDS FOR DEPLOYMENT AND BATCH WHITELISTING.

1. DEV ENVIRONMENT:
    + npx hardhat compile : To compile your contracts in your Hardhat project.

    + npx hardhat test : To test your contracts with all the .spec.ts file in test folder.

    + npm run add:whitelist : To batch add whitelisted users to list.

2. RINKEBY DEPLOYMENT: 

    + npm run rinkeby:deploy : To deploy contracts to rinkeby testnet for testing purpose.

    + npm run rinkeby:verify : To verify contracts after deployed to rinkeby successful.

3. MAINNET DEPLOYMENT:
    + npm run mainnet:deploy : To deploy contracts to mainnet.

    + npm run mainnet:verify : To verify contracts after deployed to mainnet successful.

## MAIN CONTRACT FUNCTIONS.
1.  function addToPresaleList(address[] calldata entries, uint[] calldata maxAmounts) external onlyOwner;
    * Add Whitelisted users to Presale list with corresponding max amounts.
    * Params: 
        + entries: Addresses of whitelisted users.
        + maxAmounts: Maximum amount of NFT can be bought by each Whitelisted users.

2.  function removeFromPresaleList(address[] calldata entries) external onlyOwner;
    * Remove Whitelisted users From Presale list.
    * Params: 
        + entries: Addresses of whitelisted users

3.  function buy(uint256 tokenQuantity) external payable;
    * Purchase NFT in public sale.
    * Params: 
        + tokenQuantity: Amounts of NFT that user want to buy.

4.  function presaleBuy(uint256 tokenQuantity) external payable;
    * Purchase NFT in PreSale.
    * Params: 
        + tokenQuantity: Amounts of NFT that user want to buy.

5.  function gift(address[] calldata receivers) external onlyOwner;
    * Gifting NFT to other users.
    * Params: 
        + receivers: addresses of receivers

6.  function withdraw() external onlyOwner;
    * Owner can withdraw raising amounts.

7.  function togglePresaleStatus() external;
    * Turn On/Off Presale Round.

8.  function toggleSaleStatus() external;
    * Turn On/Off Public Sale Round.

9.  function setBaseURI(string calldata URI) external onlyOwner;
    * Update Base URI when revealing real metadata.
    * Params:
        + URI: https://ipfs.io/ipfs/${cid}/

+ ** NOTES **  Make sure public sale and presale status can't be "ON" at the same time. For instance, if you want to active Presale, you must turn off Public Sale and turn on Presale, and vice versa.

## MAIN CONTRACT VARIABLES
1. AVARIK_GIFT: Total Amounts of NFTs for gifting. (Only owner can do gifting).
- For instance, AVARIK_GIFT = 100 => There will be maximum 100 NFTs which is prepared for gifting.
2. AVARIK_PRIVATE: Total Amounts of NFTs for PreSale.
- For instance, AVARIK_PRIVATE = 100 => There will be maximum 100 NFTs which is prepared for presale round.
3. AVARIK_PUBLIC: Total Amounts of NFTs for Public Sale.
- For instance, AVARIK_PUBLIC = 100 => There will be maximum 100 NFTs which is prepared for public sale round.
4. AVARIK_PRICE: Price of single NFT.
- For instance, AVARIK_PRICE = 0.08 ether => Users must pay 0.08 ether for each NFT that they want to buy in any round.
5. AVARIK_PER_MINT: Max NFTs per transaction can be minted in Public Sale.- For instance, AVARIK_PER_MINT = 3 => Users only able to mint max 3 NFTs per transaction in public sale round
6. AVARIK_PUBLIC_PER_SALER: Max NFTs that one person can purchase in Public Sale.
7. PUBLIC_BUY_FREEZE_TIME: freeze time that buyer need to wait for the next buy in public sale round.
8. _artistAddress: This address will receive 2/5 raising amounts when owner withdraw it.
9. giftedAmount: Total Amounts of NFTs is already gifted.
10. publicAmountMinted: Total Amount of NFTs are sold in public sale round.
11. privateAmountMinted: Total Amount of NFTs are sold in presale round.
12. presaleLive: Presale round is enabled or not
13. saleLive: Public sale round is enabled or not
14. _tokenBaseURI: Base TOKEN URI that help you link to your metadata on IPFS

## NOTES
1. Rinkeby Contract Addresses for testing purpose
    + NFT: 0x2a66D89c08E6DA9E824dCB0c9326dc383a065BE6
    + BuyPresale txs:
        - https://rinkeby.etherscan.io/tx/0xfbca5d969942d0fbeb176db62084797f3e202fe2ed5ea7877ffbf94646e86202
        - https://rinkeby.etherscan.io/tx/0xb2e09634fafcf16ea956ac5e6a4befdb5afec9a4a7049157d2d560c2e7583ead
        - https://rinkeby.etherscan.io/tx/0x321dce8ed140011ea7a3e99965620db2238f7e0f7cb445baa6ae4dc60a45004b

2. NOTES WHEN EXECUTING BATCH WHITELISTING:
    - In smart-contract folder, i prepare whitelist.json file inside settings folder. You guys can check it out and fill it with your whitelisted users. It's a json object with key is whitelisted user's address and value is maximum NFT that user can buy in presale round.
    - After that, You can execute add:whitelist script to execute addToPresaleList function in smart contract. 
    - In .env file, you must change the below variables:
        + NETWORK: switch to "mainnet" if you want to deploy to ethereum mainnet.
        + AVARIK_ADDRESS: Address of NFT on ethereum mainnet.
        + DEPLOYER_PRIVATE_KEY: Private key of Owner NFT contract.
        + INFURA_API_KEY: Infura API key if you have. Otherwise, check out "https://infura.io/" for more information.