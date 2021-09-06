'use strict';

const fs = require('fs');

const runAsync = async () => {
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
     
    const fileDetailss = [];

    for (let i = 0; i <= 10000; i++) {
        metaData.name = `The Sevens V4 #${i}`;
        let data = JSON.stringify(metaData);
        fs.writeFileSync(`./metadata/${i}`, data);
    }
}

runAsync();