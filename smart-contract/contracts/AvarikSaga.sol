// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
                                          
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract AvarikSaga is ERC721Enumerable, Ownable {
    using Strings for uint256;
    
    uint256 public constant AVARIK_GIFT = 88;
    uint256 public constant AVARIK_PRIVATE = 800;
    uint256 public constant AVARIK_PUBLIC = 8000;
    uint256 public constant AVARIK_MAX = AVARIK_GIFT + AVARIK_PUBLIC + AVARIK_PRIVATE;
    uint256 public constant AVARIK_PRICE = 0.08 ether;
    uint256 public constant AVARIK_PER_MINT = 3;
    uint256 public constant AVARIK_PUBLIC_PER_SALER = 5;
    
    mapping(address => uint256) public presalerList;
    mapping(address => uint256) public presalerListPurchases;
    mapping(address => uint256) public salerListPurchases;
    mapping(address => uint256) public salerLastPurchased;
    
    string private _contractURI;
    string private _tokenBaseURI;
    string private _defaultBaseURI;
    address private _artistAddress = 0xea68212b0450A929B14726b90550933bC12fF813;
    
    string public proof;
    uint256 public giftedAmount;
    uint256 public publicAmountMinted;
    uint256 public privateAmountMinted;
    uint256 public PUBLIC_BUY_FREEZE_TIME = 600;
    bool public presaleLive;
    bool public saleLive;
    
    constructor(string memory tokenBaseURI_) ERC721("Avarik Saga", "AVARIK") {
        _tokenBaseURI = tokenBaseURI_;
    }
    
    function addToPresaleList(address[] calldata entries, uint[] calldata maxAmounts) external onlyOwner {
        require(entries.length == maxAmounts.length, "DIFFERENT_SIZE");
        for(uint256 i = 0; i < entries.length; i++) {
            address entry = entries[i];
            require(entry != address(0), "NULL_ADDRESS");
            presalerList[entry] = maxAmounts[i];
        }   
    }

    function removeFromPresaleList(address[] calldata entries) external onlyOwner {
        for(uint256 i = 0; i < entries.length; i++) {
            address entry = entries[i];
            require(entry != address(0), "NULL_ADDRESS");
            
            presalerList[entry] = 0;
        }
    }
    
    function buy(uint256 tokenQuantity) external payable {
        require(!Address.isContract(msg.sender), "Not allow to call from other contracts");
        require(block.timestamp > salerLastPurchased[msg.sender], "Not allow to purchase in freeze time!");
        require(saleLive, "Sale is not live");
        require(!presaleLive, "Only presalers can buy");
        require(totalSupply() < AVARIK_MAX, "All Avariks are minted");
        require(publicAmountMinted + tokenQuantity <= AVARIK_PUBLIC, "Minting would exceed the max pubic supply");
        require(tokenQuantity <= AVARIK_PER_MINT, "You can mint up to 3 Avariks per transaction");
        require(salerListPurchases[msg.sender] + tokenQuantity <= AVARIK_PUBLIC_PER_SALER, "You can not mint exceeds maximum NFT");
        require(AVARIK_PRICE * tokenQuantity <= msg.value, "Insufficient ETH sent");
        
        salerLastPurchased[msg.sender] = block.timestamp + PUBLIC_BUY_FREEZE_TIME;

        for(uint256 i = 0; i < tokenQuantity; i++) {
            publicAmountMinted++;
            salerListPurchases[msg.sender]++;
            _safeMint(msg.sender, totalSupply() + 1);
        }
    }
    
    function presaleBuy(uint256 tokenQuantity) external payable {
        require(!saleLive && presaleLive, "The presale is closed");
        require(presalerList[msg.sender] > 0, "You are not qualified for the presale");
        require(totalSupply() < AVARIK_MAX, "All Avariks are minted");
        require(privateAmountMinted + tokenQuantity <= AVARIK_PRIVATE, "Minting would exceed the presale allocation");
        require(presalerListPurchases[msg.sender] + tokenQuantity <= presalerList[msg.sender], "You can not mint exceeds maximum NFT");
        require(AVARIK_PRICE * tokenQuantity <= msg.value, "Insufficient ETH sent");
        
        for (uint256 i = 0; i < tokenQuantity; i++) {
            privateAmountMinted++;
            presalerListPurchases[msg.sender]++;
            _safeMint(msg.sender, totalSupply() + 1);
        }
    }
    
    function gift(address[] calldata receivers) external onlyOwner {
        require(totalSupply() + receivers.length <= AVARIK_MAX, "MAX_MINT");
        require(giftedAmount + receivers.length <= AVARIK_GIFT, "GIFTS_EMPTY");
        
        for (uint256 i = 0; i < receivers.length; i++) {
            giftedAmount++;
            _safeMint(receivers[i], totalSupply() + 1);
        }
    }
    
    function withdraw() external onlyOwner {
        payable(_artistAddress).transfer(address(this).balance * 2 / 5);
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function isPresaler(address addr) external view returns (bool) {
        return presalerList[addr] > 0;
    }
    
    function presalePurchasedCount(address addr) external view returns (uint256) {
        return presalerListPurchases[addr];
    }

    function isSaleActive() external view returns(bool) {
        return saleLive;
    }
    
    function isPresaleActive() external view returns(bool) {
        return presaleLive;
    }
    // Owner functions for enabling presale, sale, revealing and setting the provenance hash
    function togglePresaleStatus() external onlyOwner {
        presaleLive = !presaleLive;
    }
    
    function toggleSaleStatus() external onlyOwner {
        saleLive = !saleLive;
    }
    
    function setProvenanceHash(string calldata hash) external onlyOwner {
        proof = hash;
    }
    
    function setContractURI(string calldata URI) external onlyOwner {
        _contractURI = URI;
    }
    
    function setBaseURI(string calldata URI) external onlyOwner {
        _tokenBaseURI = URI;
    }
    
    function setDefaultBaseURI(string calldata URI) external onlyOwner {
        _defaultBaseURI = URI;
    }
    
    // aWYgeW91IHJlYWQgdGhpcywgc2VuZCBGcmVkZXJpayMwMDAxLCAiZnJlZGR5IGlzIGJpZyI=
    function contractURI() public view returns (string memory) {
        return _contractURI;
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "Cannot query non-existent token");
        
        return bytes(_tokenBaseURI).length > 0 ? string(abi.encodePacked(_tokenBaseURI, tokenId.toString())) : _defaultBaseURI;
    }
}
