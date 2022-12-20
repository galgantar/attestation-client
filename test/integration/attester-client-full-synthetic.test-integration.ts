// This should always be on the top of the file, before imports
import { toHex } from '@flarenetwork/mcc';
import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from "fs";
import { any } from 'hardhat/internal/core/params/argumentTypes';
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { AttesterClient } from '../../lib/attester/AttesterClient';
import { AttesterClientConfiguration, AttesterCredentials } from '../../lib/attester/AttesterClientConfiguration';
import { ChainsConfiguration } from '../../lib/source/ChainConfiguration';
import { readSecureConfig, readSecureCredentials } from '../../lib/utils/configSecure';
import { getWeb3, relativeContractABIPathForContractName, waitFinalize3Factory } from '../../lib/utils/utils';
import { StateConnectorTempTran } from '../../typechain-web3-v1/StateConnectorTempTran';
import { getTestFile } from "../test-utils/test-utils";
import { bootstrapTestVerifiers, VerifierBootstrapOptions, VerifierTestSetups } from '../verification/test-utils/verifier-test-utils';
chai.use(chaiAsPromised);

const RPC = "http://127.0.0.1:8545"
const BUFFER_WINDOW = 5;
const CONTRACT_NAME = "StateConnectorTempTran";
const PRIVATE_KEY = "0xc5e8f61d1ab959b397eecc0a37a6517b8e67a0e7cf1f4bce5591f3ed80199122"
const DEFAULT_GAS = "2500000";
const DEFAULT_GAS_PRICE = "300000000000";

const NUMBER_OF_CONFIRMATIONS_XRP = 1;
const NUMBER_OF_CONFIRMATIONS_BTC = 6;
const FIRST_BLOCK = 100;
const LAST_BLOCK = 203;
const LAST_CONFIRMED_BLOCK = 200;
const BLOCK_CHOICE = 150;
const TXS_IN_BLOCK = 10;
const CONFIG_PATH = "../test/integration/test-data/configs"


async function sendAttestationRequest(web3: Web3, account: any, stateConnector: StateConnectorTempTran, waitFinalize3: any, requestBytes: string) {
   const fnToEncode = stateConnector.methods.requestAttestations(requestBytes);
   let nonce = await web3.eth.getTransactionCount(account.address);
   const tx = {
      from: account.address,
      to: stateConnector.options.address,
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
      data: fnToEncode.encodeABI(),
      nonce,
   };

   const signedTx = await account.signTransaction(tx);
   return await waitFinalize3(account.address, () => web3.eth.sendSignedTransaction(signedTx.rawTransaction!));
}

describe(`Attester client full on synthetic verifier data (${getTestFile(__filename)})`, () => {
   let stateConnectorAddress: string;
   let stateConnector: StateConnectorTempTran;
   let web3: Web3;
   let chainId: number;
   let wallet: any;
   let waitFinalize3; any;

   let setup: VerifierTestSetups;

   before(async () => {
      let abiPath = await relativeContractABIPathForContractName(CONTRACT_NAME, "artifacts");
      const compileData = JSON.parse(fs.readFileSync(`artifacts/${abiPath}`).toString());
      web3 = getWeb3(RPC) as Web3;

      let contract = new web3.eth.Contract(compileData.abi as AbiItem[]);
      chainId = await web3.eth.getChainId();
      wallet = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
      waitFinalize3 = waitFinalize3Factory(web3);

      // Deploy contract
      const constructorData = contract.deploy({
         data: compileData.bytecode,
         arguments: [wallet.address],
      }).encodeABI();

      const tx = {
         from: wallet.address,
         gas: toHex(DEFAULT_GAS),
         gasPrice: toHex(DEFAULT_GAS_PRICE),
         chainId: chainId,
         data: constructorData,
      };
      const signed = await wallet.signTransaction(tx);
      const rec = await web3.eth.sendSignedTransaction(signed.rawTransaction);
      stateConnectorAddress = rec.contractAddress;
      console.log("Deployed:", stateConnectorAddress);
      stateConnector = (new web3.eth.Contract(compileData.abi, stateConnectorAddress)) as any;

      // VERIFIERS 

      let bootstrapOptions = {
         CONFIG_PATH, FIRST_BLOCK, LAST_BLOCK, LAST_CONFIRMED_BLOCK, TXS_IN_BLOCK, BLOCK_CHOICE
      } as VerifierBootstrapOptions;

      setup = await bootstrapTestVerifiers(bootstrapOptions);

      process.env.TEST_CREDENTIALS = "1"
      const chains = await readSecureConfig(new ChainsConfiguration(), "chains");
      const config = await readSecureConfig(new AttesterClientConfiguration(), "attester");
      const credentials = await readSecureCredentials(new AttesterCredentials(), "attester");


      // Create attester client
      const attesterClient = new AttesterClient(config, credentials, chains);
      // return await attesterClient.runAttesterClient();

   });

   it("Should verify existence of State connector", async function () {
      let bufferWindowSec = parseInt(await stateConnector.methods.BUFFER_WINDOW().call());
      // console.log(bufferWindowSec)
      assert(bufferWindowSec === BUFFER_WINDOW, "Buffer windows do not match");
   });

   it("Should send attestation request and receive event", async function () {
      let data = "0x123456";
      let receipt = await sendAttestationRequest(web3, wallet, stateConnector, waitFinalize3, data);
      assert(receipt.status, "Transaction failed")
      let events = await stateConnector.getPastEvents("AttestationRequest", { fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber });
      assert(events.length === 1, "Should be 1 event");
      assert(events[0].transactionHash === receipt.transactionHash, "Wrong transaction");
      assert(events[0].event === "AttestationRequest", "Wrong event");
      assert(events[0].returnValues.data === data, "Wrong data")
   });



});
