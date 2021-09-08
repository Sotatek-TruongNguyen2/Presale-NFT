import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const deployVampire: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts} = hre;
    const {deploy, execute} = deployments;
    const {deployer} = await getNamedAccounts();
    
    // You only need to change cid right here
    const cid = "QmVU8i23TV6MXvt3cuu9voRZVHS9SvkhW7rgsNVUJGBEuM";
    const defaultBaseURI = `https://ipfs.io/ipfs/${cid}/`;

    const { address: contractAddress } = await deploy('AvarikSaga', {
      from: deployer,
      args: [defaultBaseURI],
      log: true,
      deterministicDeployment: false,
      gasPrice: "0xEE6B2800"
    });

    // // This execution below will turn on pre sale status immediately 
    // await execute(
    //     "SneakyVampireSyndicate", 
    //     { from: deployer, gasLimit: "300000", log: true }, 
    //     "togglePresaleStatus"
    // );


    // // This execution below will add list addresses to presale whitelist
    // await execute(
    //     "SneakyVampireSyndicate", 
    //     { from: deployer, gasLimit: "300000", log: true }, 
    //     "addToPresaleList", 
    //     [deployer]
    // );
};

deployVampire.tags = ["VAMPIRE"];

export default deployVampire;
