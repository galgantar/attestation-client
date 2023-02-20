// yarn test test/attestationClient/attestationClient.test.ts

import { traceManager } from "@flarenetwork/mcc";
import BN from "bn.js";
import chai, { expect } from 'chai';
import chaiAsPromised from "chai-as-promised";
import { Attestation } from "../../src/attester/Attestation";
import { AttestationData } from "../../src/attester/AttestationData";
import { AttestationRoundManager } from "../../src/attester/AttestationRoundManager";
import { AttestationClientConfig } from "../../src/attester/configs/AttestationClientConfig";
import { FlareConnection } from "../../src/attester/FlareConnection";
import { SourceRouter } from "../../src/attester/source/SourceRouter";
import { setRetryFailureCallback } from "../../src/utils/helpers/promiseTimeout";
import { AttLogger, getGlobalLogger, initializeTestGlobalLogger } from "../../src/utils/logging/logger";
import { TestLogger } from "../../src/utils/logging/testLogger";
import { SourceId } from "../../src/verification/sources/sources";
import { TERMINATION_TOKEN } from "../test-utils/test-utils";
chai.use(chaiAsPromised);

class MockSourceRouter extends SourceRouter {
  constructor() {
    super(undefined, getGlobalLogger());
  }
  validateTransaction(sourceId: SourceId, transaction: Attestation) { }
}

class MockFlareConnection extends FlareConnection {
  constructor(config: AttestationClientConfig, logger: AttLogger) {
    super(config, logger, false);
  }

  async initialize() {}

  protected checkHex64(bnString: string) {
    if (bnString.length != 64 + 2 || bnString[0] !== "0" || bnString[1] !== "x") {
      this.logger.error(`invalid BN formating ${bnString}`);
    }
  }

  async submitAttestation(
    action: string,
    bufferNumber: BN,
    // commit
    commitedMerkleRoot: string,
    commitedMaskedMerkleRoot: string,
    commitedRandom: string,
    // reveal
    revealedMerkleRoot: string,
    revealedRandom: string,

    verbose = true
  ) {
    const roundId = bufferNumber.toNumber() - 1;
    this.checkHex64(commitedMerkleRoot);
    this.checkHex64(commitedMaskedMerkleRoot);
    this.checkHex64(commitedRandom);
    this.checkHex64(revealedMerkleRoot);
    this.checkHex64(revealedRandom);
  }
}

describe("Attestation Client", () => {
  let attestationRoundManager: AttestationRoundManager;

  before(async function () {
    initializeTestGlobalLogger();

    setRetryFailureCallback((label: string) => {
      throw new Error(TERMINATION_TOKEN);
    });

    traceManager.displayStateOnException = false;
  });

  beforeEach(async function () {
    TestLogger.clear();

    const logger = getGlobalLogger();

    // Reading configuration
    const config = new AttestationClientConfig();

    const flareConnection = new MockFlareConnection(config, logger);
    const sourceRouter = new MockSourceRouter();
    attestationRoundManager = new AttestationRoundManager(config, logger, flareConnection, sourceRouter);
    // override initially generated source router
    
  });

  ////////////////////////////////
  // Unit tests
  ////////////////////////////////
  it(`Create attestation sourceId and type from event`, async function () {
    const mockEvent = {
      blockNumber: 1,
      logIndex: 2,
      returnValues: {
        timestamp: 3,
        data: "0x5d0d557df9c7e2d70ac3ebe35117c25bb1ffa8873fac714dec6c4e362da8f3b6",
      },
    };

    const attestation = new AttestationData(mockEvent as any);

    expect(attestation.sourceId, "attestation.sourceId should be 1434319303").to.eq(1434319303);
    expect(attestation.type, "attestation.type should be 23821").to.eq(23821);
  });

  ////////////////////////////////
  // Integration tests
  ////////////////////////////////
  it.skip(`Attestate Valid Request`, async function () {
    const mockEvent = {
      blockNumber: 10,
      logIndex: 1,
      returnValues: {
        timestamp: 123,
        data: "0x5d0d557df9c7e2d70ac3ebe35117c25bb1ffa8873fac714dec6c4e362da8f3b6",
      },
    };

    const attestation = new AttestationData(mockEvent as any);

    await attestationRoundManager.onAttestationRequest(attestation);

    expect(TestLogger.exists("waiting on block 70015100 to be valid"), "block should be valid at start").to.eq(false);
  });
});