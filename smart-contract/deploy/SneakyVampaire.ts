import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const deployVampire: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts} = hre;
    const {deploy, execute} = deployments;
    const {deployer} = await getNamedAccounts();
    
    const { address: contractAddress } = await deploy('SneakyVampireSyndicate', {
      from: deployer,
      args: [],
      log: true,
      deterministicDeployment: false,
      gasPrice: "0x3B9ACA00"
    });

    await execute("SneakyVampireSyndicate", { from: deployer, gasLimit: "300000", log: true }, "setBaseURI", "https://ipfs.io/ipfs/QmVULe9fPrAK3UiiCLFkS4USW8jef8tjutSbwD2Mzj83Hj/");
    await execute("SneakyVampireSyndicate", { from: deployer, gasLimit: "300000", log: true }, "togglePresaleStatus");
    await execute("SneakyVampireSyndicate", { from: deployer, gasLimit: "300000", log: true }, "addToPresaleList", [deployer]);
    await execute("SneakyVampireSyndicate", { from: deployer, gasLimit: "300000", log: true, value: "1000000000000000000" }, "presaleBuy", "2");
    // await new Promise((res, rej) => {
    //   setTimeout(async () => {
    //     res(
    //       await hre.run("verify:verify", {
    //         address: contractAddress,
    //         constructorArguments: deployArgs,
    //       })
    //     )
    //   }, 13000);
    // })
};

deployVampire.tags = ["VAMPIRE"];

export default deployVampire;