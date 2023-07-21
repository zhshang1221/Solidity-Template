// set tasks
import "./tasks/greetings";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-gas-reporter";
import "hardhat-spdx-license-identifier";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import "solidity-coverage";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;

const privateKey: string | undefined = process.env.PRIVATE_KEY;

if (!privateKey && !mnemonic) {
	throw new Error("Please set your PRIVATE_KEY or MNEMONIC in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
	throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const chainIds = {
	hardhat: 31337,
	arbitrumGoerli: 421613,
};

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
	let jsonRpcUrl: string;
	switch (chain) {
		case "arbitrumGoerli":
			jsonRpcUrl = "https://api.zan.top/node/v1/arb/goerli/public";
			break;
		default:
			jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;
	}

	let accounts: [] | any;
	// if (mnemonic) {
	//   accounts = {
	//     count: 10,
	//     mnemonic,
	//     path: "m/44'/60'/0'/0",
	//   }
	// } else {
	accounts = [`0x${privateKey}`];
	// }
	return {
		accounts: accounts,
		chainId: chainIds[chain],
		url: jsonRpcUrl,
	};
}

const config: HardhatUserConfig = {
	defaultNetwork: "hardhat",
	etherscan: {
		apiKey: {
			arbitrumGoerli: process.env.ARBISCAN_API_KEY || "",
		},
	},

	namedAccounts: {
		deployer: {
			default: 0,
			localhost: 0,
			arbitrumGoerli: 0,
		},
		testAddress: {
			default: 1,
			localhost: 1,
			arbitrumGoerli: 1,
		},
	},

	gasReporter: {
		currency: "USD",
		enabled: process.env.REPORT_GAS == "true" ? true : false,
		excludeContracts: [],
		src: "./contracts",
	},
	networks: {
		hardhat: {
			accounts: {
				mnemonic,
			},
			chainId: chainIds.hardhat,
		},
		arbitrumGoerli: getChainConfig("arbitrumGoerli"),
	},
	paths: {
		artifacts: "./artifacts",
		cache: "./cache",
		sources: "./contracts",
		tests: "./test",
	},
	solidity: {
		version: "0.8.13",
		settings: {
			metadata: {
				// Not including the metadata hash
				// https://github.com/paulrberg/solidity-template/issues/31
				bytecodeHash: "none",
			},
			// Disable the optimizer when debugging
			// https://hardhat.org/hardhat-network/#solidity-optimizer-support
			optimizer: {
				enabled: true,
				runs: 800,
			},
		},
	},
	typechain: {
		outDir: "./typechain",
		target: "ethers-v5",
	},
	spdxLicenseIdentifier: {
		overwrite: true,
		runOnCompile: true,
	},
};

export default config;