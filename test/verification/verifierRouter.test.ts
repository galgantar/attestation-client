import { ChainType, prefix0x } from "@flarenetwork/mcc";
import { INestApplication } from "@nestjs/common";
import { WsAdapter } from "@nestjs/platform-ws";
import { Test } from '@nestjs/testing';
import { getEntityManagerToken } from "@nestjs/typeorm";
import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { EntityManager } from "typeorm";
import { Attestation } from "../../lib/attester/Attestation";
import { AttestationData } from "../../lib/attester/AttestationData";
import { DBBlockBTC, DBBlockXRP } from "../../lib/entity/indexer/dbBlock";
import { DBTransactionBase, DBTransactionBTC0, DBTransactionXRP0 } from "../../lib/entity/indexer/dbTransaction";
import { WSServerConfigurationService } from "../../lib/servers/common/src";
import { WsServerModule } from "../../lib/servers/ws-server/src/ws-server.module";
import { AttLogger, getGlobalLogger, initializeTestGlobalLogger } from "../../lib/utils/logger";
import { getUnixEpochTimestamp } from "../../lib/utils/utils";
import { WsClientOptions } from "../../lib/verification/client/WsClientOptions";
import { encodeRequest } from "../../lib/verification/generated/attestation-request-encode";
import { ARType } from "../../lib/verification/generated/attestation-request-types";
import { VerifierRouter } from "../../lib/verification/routing/VerifierRouter";
import { generateTestIndexerDB, selectBlock, selectedReferencedTx, testConfirmedBlockHeightExistsRequest, testPaymentRequest } from "../indexed-query-manager/utils/indexerTestDataGenerator";
import { getTestFile } from "../test-utils/test-utils";

chai.use(chaiAsPromised);

const WS_URL = `ws://localhost:9500?apiKey=7890`;

const defaultWsClientOptions: WsClientOptions = new WsClientOptions();
defaultWsClientOptions.url = WS_URL;

const NUMBER_OF_CONFIRMATIONS_XRP = 1;
const NUMBER_OF_CONFIRMATIONS_BTC = 6;
const FIRST_BLOCK = 100;
const LAST_BLOCK = 203;
const LAST_CONFIRMED_BLOCK = 200;
const BLOCK_CHOICE = 150;
const TXS_IN_BLOCK = 10;
const CONFIG_PATH = "../test/verification/test-data/test-verifier"

const axios = require("axios");

async function bootstrapVerifier(
  verifierType: 'xrp' | 'btc',
  lastTimestamp: number,
  dbBlock: any,
  dbTransaction: any,
  logger: AttLogger
): Promise<INestApplication> {
  process.env.CONFIG_PATH = CONFIG_PATH;
  process.env.NODE_ENV = "development";
  process.env.VERIFIER_TYPE = verifierType;
  process.env.IN_MEMORY_DB = "1";

  const chainType = ChainType[verifierType.toUpperCase()]
  let app: INestApplication;
  let configurationService: WSServerConfigurationService;
  let entityManager: EntityManager;

  const module = await Test.createTestingModule({
    imports: [WsServerModule]
  }).compile();
  app = module.createNestApplication();

  app.useWebSocketAdapter(new WsAdapter(app));

  configurationService = app.get(WSServerConfigurationService);
  entityManager = app.get(getEntityManagerToken("indexerDatabase"));

  let port = configurationService.wsServerConfiguration.port;
  await app.listen(port, undefined, () => {
    logger.info(`Server started listening at http://localhost:${configurationService.wsServerConfiguration.port}`);
    logger.info(`Websocket server started listening at ws://localhost:${configurationService.wsServerConfiguration.port}`)
  })
  await app.init();

  await generateTestIndexerDB(
    chainType,
    entityManager,
    dbBlock,
    dbTransaction,
    FIRST_BLOCK,
    LAST_BLOCK,
    lastTimestamp,
    LAST_CONFIRMED_BLOCK,
    TXS_IN_BLOCK,
    lastTimestamp
  );
  return app;
}

function prepareAttestation(request: ARType, startTime: number): Attestation {
  const data = new AttestationData();
  data.type = request.attestationType;
  data.sourceId = request.sourceId;
  data.request = encodeRequest(request);
  const attestation = new Attestation(undefined, data, undefined);
  attestation.windowStartTime = startTime + 1;
  attestation.UBPCutoffTime = startTime;
  return attestation;
}

describe(`VerifierRouter tests (${getTestFile(__filename)})`, () => {

  let appXRP: INestApplication;
  let appBTC: INestApplication;
  let lastTimestamp: number = 0;
  let startTime: number = 0;
  let selectedTransactionXRP: DBTransactionBase;
  let selectedTransactionBTC: DBTransactionBase;
  let entityManagerXRP: EntityManager;
  let entityManagerBTC: EntityManager;
  let configXRP: WSServerConfigurationService;
  let configBTC: WSServerConfigurationService;

  before(async () => {

    initializeTestGlobalLogger();
    const logger = getGlobalLogger("web");
    lastTimestamp = getUnixEpochTimestamp();

    appXRP = await bootstrapVerifier("xrp", lastTimestamp, DBBlockXRP, DBTransactionXRP0, logger);
    appBTC = await bootstrapVerifier("btc", lastTimestamp, DBBlockBTC, DBTransactionBTC0, logger);

    entityManagerXRP = appXRP.get(getEntityManagerToken("indexerDatabase"));
    entityManagerBTC = appBTC.get(getEntityManagerToken("indexerDatabase"));

    configXRP = appXRP.get(WSServerConfigurationService);
    configBTC = appBTC.get(WSServerConfigurationService);

    selectedTransactionXRP = await selectedReferencedTx(entityManagerXRP, DBTransactionXRP0, BLOCK_CHOICE);
    selectedTransactionBTC = await selectedReferencedTx(entityManagerBTC, DBTransactionBTC0, BLOCK_CHOICE, 5);

    startTime = lastTimestamp - (LAST_BLOCK - FIRST_BLOCK);
  });


  it(`Should verify attestation`, async function () {
    process.env.CONFIG_PATH = CONFIG_PATH;
    const verifierRouter = new VerifierRouter();
    await verifierRouter.initialize(false);

    let requestXRP = await testPaymentRequest(entityManagerXRP, selectedTransactionXRP, DBBlockXRP, NUMBER_OF_CONFIRMATIONS_XRP, ChainType.XRP);
    const attestationXRP = prepareAttestation(requestXRP, startTime);

    let requestBTC = await testPaymentRequest(entityManagerBTC, selectedTransactionBTC, DBBlockBTC, NUMBER_OF_CONFIRMATIONS_BTC, ChainType.BTC);
    const attestationBTC = prepareAttestation(requestBTC, startTime);

    let respXRP = await verifierRouter.verifyAttestation(attestationXRP, attestationXRP.reverification);

    assert(respXRP.status === "OK", "Wrong server response");
    assert(respXRP.data.response.transactionHash === prefix0x(selectedTransactionXRP.transactionId), "Wrong transaction id");

    let respBTC = await verifierRouter.verifyAttestation(attestationBTC, attestationBTC.reverification);

    assert(respBTC.status === "OK", "Wrong server response");
    assert(respBTC.data.response.transactionHash === prefix0x(selectedTransactionBTC.transactionId), "Wrong transaction id");
  });



  it(`Should fail due to sending wrong source id`, async function () {
    process.env.CONFIG_PATH = CONFIG_PATH;
    const verifierRouter = new VerifierRouter();
    await verifierRouter.initialize(false);

    let confirmationBlock = await selectBlock(entityManagerXRP, DBBlockXRP, BLOCK_CHOICE);
    let requestXRP = await testConfirmedBlockHeightExistsRequest(confirmationBlock, ChainType.XRP);

    const attestationXRP = prepareAttestation(requestXRP, startTime);

    await expect(verifierRouter.verifyAttestation(attestationXRP, attestationXRP.reverification)).to.eventually.be.rejectedWith("Local verification not enabled");

  });

  after(async () => {
    await appXRP.close();
  });

});



