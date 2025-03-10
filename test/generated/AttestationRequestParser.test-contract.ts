//////////////////////////////////////////////////////////////
// This file is auto generated. Do not edit.
//////////////////////////////////////////////////////////////

import {
  ARPayment,
  ARBalanceDecreasingTransaction,
  ARConfirmedBlockHeightExists,
  ARReferencedPaymentNonexistence,
} from "../../src/verification/generated/attestation-request-types";
import { AttestationType } from "../../src/verification/generated/attestation-types-enum";
import { SourceId } from "../../src/verification/sources/sources";
import { getRandomRequestForAttestationTypeAndSourceId } from "../../src/verification/generated/attestation-random-utils";
import { encodeRequest } from "../../src/verification/generated/attestation-request-encode";
import { parseRequest } from "../../src/verification/generated/attestation-request-parse";
import { equalsRequest } from "../../src/verification/generated/attestation-request-equals";
import { getTestFile } from "../test-utils/test-utils";

describe(`Attestestation Request Parser (${getTestFile(__filename)})`, function () {
  it("Should encode and decode for 'Payment'", async function () {
    for (const sourceId of [3, 0, 1, 2, 4]) {
      const randomRequest = getRandomRequestForAttestationTypeAndSourceId(1 as AttestationType, sourceId as SourceId) as ARPayment;

      const bytes = encodeRequest(randomRequest);
      const parsedRequest = parseRequest(bytes);
      assert(equalsRequest(randomRequest, parsedRequest));
    }
  });

  it("Should encode and decode for 'BalanceDecreasingTransaction'", async function () {
    for (const sourceId of [3, 0, 1, 2, 4]) {
      const randomRequest = getRandomRequestForAttestationTypeAndSourceId(2 as AttestationType, sourceId as SourceId) as ARBalanceDecreasingTransaction;

      const bytes = encodeRequest(randomRequest);
      const parsedRequest = parseRequest(bytes);
      assert(equalsRequest(randomRequest, parsedRequest));
    }
  });

  it("Should encode and decode for 'ConfirmedBlockHeightExists'", async function () {
    for (const sourceId of [3, 0, 1, 2, 4]) {
      const randomRequest = getRandomRequestForAttestationTypeAndSourceId(3 as AttestationType, sourceId as SourceId) as ARConfirmedBlockHeightExists;

      const bytes = encodeRequest(randomRequest);
      const parsedRequest = parseRequest(bytes);
      assert(equalsRequest(randomRequest, parsedRequest));
    }
  });

  it("Should encode and decode for 'ReferencedPaymentNonexistence'", async function () {
    for (const sourceId of [3, 0, 1, 2, 4]) {
      const randomRequest = getRandomRequestForAttestationTypeAndSourceId(4 as AttestationType, sourceId as SourceId) as ARReferencedPaymentNonexistence;

      const bytes = encodeRequest(randomRequest);
      const parsedRequest = parseRequest(bytes);
      assert(equalsRequest(randomRequest, parsedRequest));
    }
  });
});
