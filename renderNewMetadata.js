'use strict';

const {create} = require('ipfs-http-client');
const fs = require('fs');

const runAsync = async () => {

    // const ipfs = create('/ip4/127.0.0.1/tcp/5001')
    let metaDatas = [
        {
            "name": "The Sevens V4 #1",
            "image": "ipfs://QmWGhDYrpax3T2r6pt6sCfk6PKHSVs4mMzJVds35YyR7b7",
            "attributes": [
                {
                    "trait_type": "Status",
                    "value": "Revealed"
                }
            ]
        },
        {
            "name": "The Sevens V4 #2",
            "image": "ipfs://QmSngWdmbnfhUydbJtGqrSrZePKpVdTYSeKJFcD1VZRHFE",
            "attributes": [
                {
                    "trait_type": "Status",
                    "value": "Revealed"
                }
            ]
        }
    ]

    for (let i = 1; i <= metaDatas.length; i++) {
        let data = JSON.stringify(metaDatas[i - 1]);
        console.log(data);
        fs.writeFileSync(`./smart-contract-metadata/realMetadata/${i}`, data);
    }
}

runAsync();
