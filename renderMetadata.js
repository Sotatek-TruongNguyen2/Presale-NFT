'use strict';

const {create} = require('ipfs-http-client');
const fs = require('fs');

const runAsync = async () => {

    // const ipfs = create('/ip4/127.0.0.1/tcp/5001')
    let metaData = {
        "name": "The Sevens V3 #",
        "image": "ipfs://QmWGajRaKoNVtrAV3SVaoiobNJhbwQ5oZJPyN7Aesnm7My",
        "attributes": [
            {
                "trait_type": "Status",
                "value": "Unrevealed"
            }
        ]
    };

    // const fileDetailss = [];

    for (let i = 1; i <= 10000; i++) {
        metaData.name = `The Sevens V5 #${i}`;
        let data = JSON.stringify(metaData);
        fs.writeFileSync(`./smart-contract-metadata/metadata/${i}`, data);
    }
}

runAsync();
