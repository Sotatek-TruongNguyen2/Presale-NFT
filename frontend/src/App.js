import {useState, useEffect} from 'react';
import {create} from 'ipfs-http-client';
import {ethers} from 'ethers';

import ABI from './abi/SneakyVampireSyndicate.json';
import './App.css';

function App() {
  const [instance, setInstance] = useState(null);
  const [nftPrice, setNftPrice] = useState("0");
  const [tokenId, setTokenId] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [tokenURIData, setTokenURIData] = useState(null);
  const [presaleStatus, setPresaleStatus] = useState(false);
  const [input, setInput] = useState("");
  const [replace, setReplace] = useState(false);

  const queryFromIPFS = async (id) => {
    let tokenURI = "";

    tokenURI = await instance.tokenURI(id);

    if (replace) {
      tokenURI = `https://ipfs.io/ipfs/QmSy4DbJnDNepqej9Hxp3Rfc9Vmvwg3u2dNu2fQF5HFrfU/${id}`
    }

    setTokenURI(tokenURI);

    fetch(`${tokenURI}`)
      .then(res => res.json()).then(data => {
        console.log(data.image);
        setTokenURIData(data)
      });
  }

  const getContractInstance = async () => {
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const presaleAddress = "0x87c3215720fE3140f326A24450bD8db4d8536Daf";
    const contract = new ethers.Contract(presaleAddress, ABI, signer);
    console.log(contract);
    setInstance(contract);
  }

  const addToWhitelist = async () => {
    const tx = await instance.addToPresaleList([input], [8]);
    const receipt = await tx.wait(1);
    console.log(receipt);
  }

  const togglePresaleStatus = async () => {
    const tx = await instance.togglePresaleStatus();
    const receipt = await tx.wait(1);
    console.log(receipt);
  }

  const buyPresaleNFT = async () => {
    const tx = await instance.presaleBuy(2, {value: "1000000000000000000"});
    const receipt = await tx.wait(1);
    console.log(receipt);
    alert("BUY SUCCESSFUL!");
  }

  const setTokenURIAfterPresale = async () => {
    const tx = await instance.setBaseURI("https://ipfs.io/ipfs/QmVEPrezT2N2ip5WiamzYK1vssYwWq5Lwottu7dReNwDh8/");
    const receipt = await tx.wait(1);
    console.log(receipt);
    alert("CHANGE TOKEN URI SUCCESSFUL!");
  }

  useEffect(() => {
    getContractInstance();
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      if (instance) {
        const price = await instance.SVS_PRICE();
        const presaleStatus = await instance.presaleLive();
        setNftPrice(ethers.utils.formatEther(price));
        setPresaleStatus(presaleStatus);
      }
    }

    getInfo();
  }, [instance]);

  return (
    <div style={{textAlign: 'center'}}>
      <p>NFT price: {nftPrice} ETH</p>
      <p>NFT Presale Open: {presaleStatus ? 'Open' : 'Not yet!'}</p>
      <br />
      <label>Address: </label>
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <br />
      <label>Token ID: </label>
      <input type="text" onChange={(e) => setTokenId(e.target.value)} style={{marginTop: 10}} />
      <br />
      <button onClick={addToWhitelist} style={{marginTop: 10}}>ADD TO WHITELIST</button>
      <br />
      <button onClick={togglePresaleStatus} style={{marginTop: 10}}>TOGGLE PRESALE STATUS</button>
      <br />
      <button onClick={buyPresaleNFT} style={{marginTop: 10}}>BUY PRESALE NFT</button>
      <br />
      <button onClick={setTokenURIAfterPresale} style={{marginTop: 10}}>SET TOKEN URI AFTER PRESALE NFT</button>
      <br />
      <div style={{marginTop: 10}}>
        <label>Real new URI: </label>
        <input type="checkbox" onChange={e => setReplace(e.target.checked)} />
      </div>
      <br />
      <button onClick={() => queryFromIPFS(tokenId)} style={{marginTop: 10}}>QUERY TOKEN URI BY TOKEN ID</button>
      <br />
      <p>TOKEN URI: {tokenURI}</p>
      {
        tokenURIData && (
          <div>
            <p>Name: {tokenURIData.name}</p>
            <p>Status: {tokenURIData.attributes[0].value}</p>
            <img src={`https://ipfs.io/ipfs/${tokenURIData.image.substring(7)}`} style={{width: 500, height: 500}} />
          </div>
        )
      }
    </div>
  );
}

export default App;
