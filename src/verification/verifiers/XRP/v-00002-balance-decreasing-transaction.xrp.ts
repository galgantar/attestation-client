//////////////////////////////////////////////////////////////
// This file is auto generated. You may edit it only in the
// marked section between //-$$$<start> and //-$$$<end>.
// You may also import custom imports needed for the code
// in the custom section, which should be placed immediately
// in the usual import section (below this comment)
//////////////////////////////////////////////////////////////

import {
  ARBalanceDecreasingTransaction,
  BN,
  DHBalanceDecreasingTransaction,
  hashBalanceDecreasingTransaction,
  IndexedQueryManager,
  MCC,
  parseBalanceDecreasingTransaction,
  randSol,
  Verification,
  VerificationStatus,
  Web3,
} from "./0imports";
import { XrpTransaction } from "@flarenetwork/mcc";
import { verifyBalanceDecreasingTransaction } from "../../verification-utils/generic-chain-verifications";

const web3 = new Web3();

export async function verifyBalanceDecreasingTransactionXRP(
  client: MCC.XRP,
  attestationRequest: string,
  indexer: IndexedQueryManager
): Promise<Verification<ARBalanceDecreasingTransaction, DHBalanceDecreasingTransaction>> {
  const request = parseBalanceDecreasingTransaction(attestationRequest) as ARBalanceDecreasingTransaction;

  //-$$$<start> of the custom code section. Do not change this comment.

  const result = await verifyBalanceDecreasingTransaction(XrpTransaction, request, indexer);
  if (result.status != VerificationStatus.OK) {
    return { status: result.status };
  }

  const response = result.response;

  //-$$$<end> of the custom section. Do not change this comment.

  const hash = hashBalanceDecreasingTransaction(request, response);

  return {
    hash,
    request,
    response,
    status: VerificationStatus.OK,
  };
}
