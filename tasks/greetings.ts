import { task } from "hardhat/config";

import { readAddressList } from "../scripts/contractAddress";

import {
    Greeter__factory
} from "../typechain";

// npx hardhat setGreeting --greeting "this is new greeting" --network localhost
task("setGreeting", "Set new greeting message")
    .addParam("greeting", "new greeting message")
    .setAction(async (taskArgs, hre) => {
        console.log("\n Setting new greeting message... \n");

        const { network } = hre;
        const greeting = taskArgs.greeting;

        // Signers
        const [dev] = await hre.ethers.getSigners();
        console.log("The default signer is:", dev.address);

        const addressList = readAddressList();

        const greeter = new Greeter__factory(dev).attach(addressList[network.name].Greeter);

        const tx = await greeter.setGreeting(greeting);
        console.log("Tx details:", await tx.wait());

        console.log("\n Finish setting new greeting message \n");
    });

task("getGreeting", "Get current greeting message")
    .setAction(async (_, hre) => {

        const { network } = hre;

        // Signers
        const [dev] = await hre.ethers.getSigners();
        const addressList = readAddressList();

        const greeter = new Greeter__factory(dev).attach(addressList[network.name].Greeter);

        const message = await greeter.greet();
        console.log("\n Current greeting message:", message, "\n");
    });