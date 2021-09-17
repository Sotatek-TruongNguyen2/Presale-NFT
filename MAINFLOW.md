I MAIN FLOWS
    1. Presale:
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
    2. Sale:
        - Step 1: Call function togglePresaleStatus again to end presale round.
        - Step 2: Call function toggleSaleStatus to start sale round.
        - Step 3: All Users can go and buy NFT by using buy function.
    3. Reveal real data:
        - Step 1: Upload images to IPFS by using "image:upload" command. NOTES: Images which will be used for revealing are placed in smart-contract-metadata/assets
        - Step 2: After uploading is finished, you can copy all cids of uploaded images and place them in imageUrl variable inside renderNewMetadata.js.
        - Step 3: Render real metadata by using "meta:reveal:render" command that i already listed in package.json file.
        - Step 4: Upload Real metadata to IPFS when presale round is ended using "meta:reveal:upload" command.
        - Step 5: Call function "setBaseURI" with new cid that we got from above: https://ipfs.io/ipfs/${cid}/.
