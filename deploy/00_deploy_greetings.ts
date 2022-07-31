import {DeployFunction, ProxyOptions} from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { readAddressList, readProxyAdmin, storeAddressList, storeProxyAdmin } from "../scripts/contractAddress";

// Deploy Greeter
// It is a non-proxy deployment
// Contract:
//      - Greeter
// Tags:
//      _ Greeter

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment){
    const {deployments, getNamedAccounts, network} = hre;
    const {deploy, save, getArtifact} = deployments;

    network.name = network.name == "hardhat" ? "localhost" : network.name;

    const {deployer} = await getNamedAccounts();
    const addressList = readAddressList();

    const greetings = await deploy("Greeter", {
        contract: "Greeter",
        from: deployer,
        args: ["default"],
        log: true
    });
    addressList[network.name].Greeter = greetings.address;

    console.log('Greetings get deployed');

    // Store the address list after deployment
    storeAddressList(addressList);
}

func.tags = ['Greeter'];
export default func;