//////////////////////////////////////////////////////////////
// This file is auto generated. Do not edit.
//////////////////////////////////////////////////////////////

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import BN from "bn.js";

export class DHPayment {
  /**
   * Round id in which the attestation request was validated.
   */
  @ApiPropertyOptional()
  stateConnectorRound?: number;
  @ApiPropertyOptional()

  /**
   * Merkle proof (a list of 32-byte hex hashes).
   */
  merkleProof?: string[];

  /**
   * Number of the transaction block on the underlying chain.
   */
  @ApiProperty({
    type: "string",
    description: `
Number of the transaction block on the underlying chain.
`,
  })
  blockNumber: BN;

  /**
   * Timestamp of the transaction block on the underlying chain.
   */
  @ApiProperty({
    type: "string",
    description: `
Timestamp of the transaction block on the underlying chain.
`,
  })
  blockTimestamp: BN;

  /**
   * Hash of the transaction on the underlying chain.
   */
  @ApiProperty({
    description: `
Hash of the transaction on the underlying chain.
`,
  })
  transactionHash: string;

  /**
   * Index of the transaction input indicating source address on UTXO chains, 0 on non-UTXO chains.
   */
  @ApiProperty({
    type: "string",
    description: `
Index of the transaction input indicating source address on UTXO chains, 0 on non-UTXO chains.
`,
  })
  inUtxo: BN;

  /**
   * Output index for a transaction with multiple outputs on UTXO chains, 0 on non-UTXO chains.
   * The same as in the 'utxo' parameter from the request.
   */
  @ApiProperty({
    type: "string",
    description: `
Output index for a transaction with multiple outputs on UTXO chains, 0 on non-UTXO chains.
The same as in the 'utxo' parameter from the request.
`,
  })
  utxo: BN;

  /**
   * Hash of the source address viewed as a string (the one indicated by the 'inUtxo'
   * parameter for UTXO blockchains).
   */
  @ApiProperty({
    description: `
Hash of the source address viewed as a string (the one indicated by the 'inUtxo'
parameter for UTXO blockchains).
`,
  })
  sourceAddressHash: string;

  /**
   * Hash of the receiving address as a string (the one indicated by the 'utxo'
   * parameter for UTXO blockchains).
   */
  @ApiProperty({
    description: `
Hash of the receiving address as a string (the one indicated by the 'utxo'
parameter for UTXO blockchains).
`,
  })
  receivingAddressHash: string;

  /**
   * The amount that went out of the source address, in the smallest underlying units.
   * In non-UTXO chains it includes both payment value and fee (gas).
   * Calculation for UTXO chains depends on the existence of standardized payment reference.
   * If it exists, it is calculated as 'outgoing_amount - returned_amount' and can be negative.
   * If the standardized payment reference does not exist, then it is just the spent amount
   * on the input indicated by 'inUtxo'.
   */
  @ApiProperty({
    type: "string",
    description: `
The amount that went out of the source address, in the smallest underlying units.
In non-UTXO chains it includes both payment value and fee (gas).
Calculation for UTXO chains depends on the existence of standardized payment reference.
If it exists, it is calculated as 'outgoing_amount - returned_amount' and can be negative.
If the standardized payment reference does not exist, then it is just the spent amount
on the input indicated by 'inUtxo'.
`,
  })
  spentAmount: BN;

  /**
   * The amount received to the receiving address, in smallest underlying units. Can be negative in UTXO chains.
   */
  @ApiProperty({
    type: "string",
    description: `
The amount received to the receiving address, in smallest underlying units. Can be negative in UTXO chains.
`,
  })
  receivedAmount: BN;

  /**
   * Standardized payment reference, if it exists, 0 otherwise.
   */
  @ApiProperty({
    description: `
Standardized payment reference, if it exists, 0 otherwise.
`,
  })
  paymentReference: string;

  /**
   * 'true' if the transaction has exactly one source address and
   * exactly one receiving address (different from source).
   */
  @ApiProperty({
    description: `
'true' if the transaction has exactly one source address and 
exactly one receiving address (different from source).
`,
  })
  oneToOne: boolean;

  /**
   * Transaction success status, can have 3 values:
   *   - 0 - Success
   *   - 1 - Failure due to sender (this is the default failure)
   *   - 2 - Failure due to receiver (bad destination address)
   */
  @ApiProperty({
    type: "string",
    description: `
Transaction success status, can have 3 values:
  - 0 - Success
  - 1 - Failure due to sender (this is the default failure)
  - 2 - Failure due to receiver (bad destination address)
`,
  })
  status: BN;
}

export class DHBalanceDecreasingTransaction {
  /**
   * Round id in which the attestation request was validated.
   */
  @ApiPropertyOptional()
  stateConnectorRound?: number;
  @ApiPropertyOptional()

  /**
   * Merkle proof (a list of 32-byte hex hashes).
   */
  merkleProof?: string[];

  /**
   * Number of the transaction block on the underlying chain.
   */
  @ApiProperty({
    type: "string",
    description: `
Number of the transaction block on the underlying chain.
`,
  })
  blockNumber: BN;

  /**
   * Timestamp of the transaction block on the underlying chain.
   */
  @ApiProperty({
    type: "string",
    description: `
Timestamp of the transaction block on the underlying chain.
`,
  })
  blockTimestamp: BN;

  /**
   * Hash of the transaction on the underlying chain.
   */
  @ApiProperty({
    description: `
Hash of the transaction on the underlying chain.
`,
  })
  transactionHash: string;

  /**
   * Index of the transaction input indicating source address on UTXO chains, 0 on non-UTXO chains.
   */
  @ApiProperty({
    type: "string",
    description: `
Index of the transaction input indicating source address on UTXO chains, 0 on non-UTXO chains.
`,
  })
  inUtxo: BN;

  /**
   * Hash of the source address as a string. For UTXO transactions with multiple input addresses
   * this is the address that is on the input indicated by 'inUtxo' parameter.
   */
  @ApiProperty({
    description: `
Hash of the source address as a string. For UTXO transactions with multiple input addresses 
this is the address that is on the input indicated by 'inUtxo' parameter.
`,
  })
  sourceAddressHash: string;

  /**
   * The amount that went out of the source address, in the smallest underlying units.
   * In non-UTXO chains it includes both payment value and fee (gas).
   * Calculation for UTXO chains depends on the existence of standardized payment reference.
   * If it exists, it is calculated as 'outgoing_amount - returned_amount' and can be negative.
   * If the standardized payment reference does not exist, then it is just the spent amount
   * on the input indicated by 'inUtxo'.
   */
  @ApiProperty({
    type: "string",
    description: `
The amount that went out of the source address, in the smallest underlying units.
In non-UTXO chains it includes both payment value and fee (gas).
Calculation for UTXO chains depends on the existence of standardized payment reference.
If it exists, it is calculated as 'outgoing_amount - returned_amount' and can be negative.
If the standardized payment reference does not exist, then it is just the spent amount
on the input indicated by 'inUtxo'.
`,
  })
  spentAmount: BN;

  /**
   * Standardized payment reference, if it exists, 0 otherwise.
   */
  @ApiProperty({
    description: `
Standardized payment reference, if it exists, 0 otherwise.
`,
  })
  paymentReference: string;
}

export class DHConfirmedBlockHeightExists {
  /**
   * Round id in which the attestation request was validated.
   */
  @ApiPropertyOptional()
  stateConnectorRound?: number;
  @ApiPropertyOptional()

  /**
   * Merkle proof (a list of 32-byte hex hashes).
   */
  merkleProof?: string[];

  /**
   * Number of the highest confirmed block that was proved to exist.
   */
  @ApiProperty({
    type: "string",
    description: `
Number of the highest confirmed block that was proved to exist.
`,
  })
  blockNumber: BN;

  /**
   * Timestamp of the confirmed block that was proved to exist.
   */
  @ApiProperty({
    type: "string",
    description: `
Timestamp of the confirmed block that was proved to exist.
`,
  })
  blockTimestamp: BN;

  /**
   * Number of confirmations for the blockchain.
   */
  @ApiProperty({
    type: "string",
    description: `
Number of confirmations for the blockchain.
`,
  })
  numberOfConfirmations: BN;

  /**
   * Lowest query window block number.
   */
  @ApiProperty({
    type: "string",
    description: `
Lowest query window block number.
`,
  })
  lowestQueryWindowBlockNumber: BN;

  /**
   * Lowest query window block timestamp.
   */
  @ApiProperty({
    type: "string",
    description: `
Lowest query window block timestamp.
`,
  })
  lowestQueryWindowBlockTimestamp: BN;
}

export class DHReferencedPaymentNonexistence {
  /**
   * Round id in which the attestation request was validated.
   */
  @ApiPropertyOptional()
  stateConnectorRound?: number;
  @ApiPropertyOptional()

  /**
   * Merkle proof (a list of 32-byte hex hashes).
   */
  merkleProof?: string[];

  /**
   * Deadline block number specified in the attestation request.
   */
  @ApiProperty({
    type: "string",
    description: `
Deadline block number specified in the attestation request.
`,
  })
  deadlineBlockNumber: BN;

  /**
   * Deadline timestamp specified in the attestation request.
   */
  @ApiProperty({
    type: "string",
    description: `
Deadline timestamp specified in the attestation request.
`,
  })
  deadlineTimestamp: BN;

  /**
   * Hash of the destination address searched for.
   */
  @ApiProperty({
    description: `
Hash of the destination address searched for.
`,
  })
  destinationAddressHash: string;

  /**
   * The payment reference searched for.
   */
  @ApiProperty({
    description: `
The payment reference searched for.
`,
  })
  paymentReference: string;

  /**
   * The amount searched for.
   */
  @ApiProperty({
    type: "string",
    description: `
The amount searched for.
`,
  })
  amount: BN;

  /**
   * The first confirmed block that gets checked. It is exactly 'minimalBlockNumber' from the request.
   */
  @ApiProperty({
    type: "string",
    description: `
The first confirmed block that gets checked. It is exactly 'minimalBlockNumber' from the request.
`,
  })
  lowerBoundaryBlockNumber: BN;

  /**
   * Timestamp of the 'lowerBoundaryBlockNumber'.
   */
  @ApiProperty({
    type: "string",
    description: `
Timestamp of the 'lowerBoundaryBlockNumber'.
`,
  })
  lowerBoundaryBlockTimestamp: BN;

  /**
   * The first (lowest) confirmed block with 'timestamp > deadlineTimestamp'
   * and 'blockNumber  > deadlineBlockNumber'.
   */
  @ApiProperty({
    type: "string",
    description: `
The first (lowest) confirmed block with 'timestamp > deadlineTimestamp' 
and 'blockNumber  > deadlineBlockNumber'.
`,
  })
  firstOverflowBlockNumber: BN;

  /**
   * Timestamp of the firstOverflowBlock.
   */
  @ApiProperty({
    type: "string",
    description: `
Timestamp of the firstOverflowBlock. 
`,
  })
  firstOverflowBlockTimestamp: BN;
}
export type DHType = DHPayment | DHBalanceDecreasingTransaction | DHConfirmedBlockHeightExists | DHReferencedPaymentNonexistence;
export const DHTypeArray = [DHPayment, DHBalanceDecreasingTransaction, DHConfirmedBlockHeightExists, DHReferencedPaymentNonexistence];
