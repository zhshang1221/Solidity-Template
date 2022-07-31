import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { solidity } from "ethereum-waffle";
import chai from "chai";
chai.use(solidity);
const { expect } = chai;

const { ethers } = require("hardhat");

import {
    Greeter,
    Greeter__factory
} from "../typechain";

describe("Greeter", function(){
    let greeterContract: Greeter__factory, greeter: Greeter;
    let dev: SignerWithAddress;

    beforeEach(async()=>{
        let [dev] = await ethers.getSigners();

        greeterContract = await ethers.getContractFactory("Greeter");
        greeter = await greeterContract.deploy("default");
        await greeter.deployed();
    })

    it("should be able to get greeting message", async()=>{
        expect(await greeter.greet()).to.equal("default");
    })

    it("should be able to set greeting message", async()=>{
        await greeter.setGreeting("new");
        expect(await greeter.greet()).to.equal("new");
    })
})