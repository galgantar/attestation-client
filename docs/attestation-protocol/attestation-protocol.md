[TOC](../README.md)
# Attestation protocol

**Attestation protocol** is a protocol in which facts from external blockchains, or external data sources in general, are proposed for attestation by users. The set of default attestation providers then votes on them by casting their votes in the form of attestations.

For example, in a simplified setting, a user proposes to the protocol a fact to be confirmed: the transaction with the transaction id `XYZ` exists in Ripple network. Given such an **attestation request**, each attestation provider will first fetch the data about the transaction from the Ripple network. It will extract from the transaction the information like transaction id, block number, block timestamp, source address, destination address, transferred amount, payment reference, etc. The data used are collectively called **attestation response**. A 32-byte hash will be produced using the attestation response, serving as the **attestation hash**, or shortly **attestation**. Such an attestation will be submitted to the protocol. Several attestation providers will do the same in parallel and submit their attestations. The protocol will collect the submitted attestations and if majority of the attestations are the same, the protocol will confirm the majority attestation hash, yielding the **confirmed attestation hash** (or **confirmed attestation**).

Then if any user would provide the attestation data, say to some contract, such a contract can calculate the hash of the attestation data and compare it to the confirmed attestation hash. In case of a match, the contract has the confirmation that the provided attestation data is valid and it can act upon that.

## Example 

In our example, the transaction with the transaction id `XYZ` in Ripple network could be a payment for some service regulated by a contract on Flare network, for which one needs to pay 100 XRP to a specific Ripple address. A user would first request the contract for the service. The contract would issue a requirement to pay 100 XRP to a specific address given a specific payment reference. The user would then carry out the payment in Ripple network, producing the payment transaction with the transaction id `XYZ`. Then it would then request the attestation protocol to attest for the transaction which would trigger the procedure described above. Once the confirmed attestation hash is obtained by the protocol, the user would submit the attestation data for transaction `XYZ` to the contract. The contract would check the attestation data containing against its requirements (e.g. 100 XRP, required receiving address, correct timing, correct payment reference, etc.). Then it would calculate the attestation hash of the provided attestation data and compare it to the confirmed attestation hash obtained by the attestation protocol. If everything would match, the contract would have the proof that the payment was correct and it could unlock the service for the user.

A simplified version of the attestation protocol described above implies that an efficient implementation of the protocol should be organized as a sequence of voting rounds, where in each voting round, attestation providers vote not just on a single fact, but on a package of facts. Here we see a clear analogy with the classic part of each blockchain consensus algorithm, where validators try to reach the consensus for the next proposed block. Namely, multiple facts can be collected together and put for a vote in a given voting round. Attestation hashes of each verified fact can be assembled using a Merkle tree into a single hash (Merkle root) which is submitted by each attestation provider for the voting round. Proving a specific attestation would in this case require combination of the confirmed attestation hash (Merkle root) and the specific Merkle proof, obtained for a specific attestation request.

A secure implementation of the protocol should also take care of preventing copying the casted votes (attestations), in a similar manner as elections are organized. In particular, this forces attestation providers to cast genuine attestations, obtained by actually checking the data on other chains. Hence a commit-reveal scheme should be applied.

## Phases of the voting rounds.

The implemented attestation protocol is managed by the [`StateConnector`](state-connector-contract.md) smart contact. Voting activities are organized using sequential **voting windows**, each of 90 seconds duration and enumerated using the sequential ID - the `bufferNumber`. Each round starts on particular 90s voting window and its sequential index, the `roundId` matches the `bufferNumber` of the voting window. A evolves through the following four phases, each lasting 90s:

- `collect` - the first 90s voting window. Attestation requests are being collected.
- `commit` - the next 90s voting window. Attestation providers are carrying out verifications, calculating attestations and submitting masked Merkle roots before the end of this phase. Each attestation provider calculates the Merkle root for the attestations collected in the `collect` phase of the round. Requests that cannot be verified (like non-existent transaction id) are omitted (no attestation hash is produced). Also each attestation provider chooses a big random number which it keeps hidden in this phase. Then it calculates XOR of the Merkle root and the random number, obtaining the **masked Merkle root**. Attestation providers submit masked Merkle roots, which act as commits for the voting rounds.
- `reveal` - the next 90s voting window. Attestation providers are revealing their votes by disclosing their random number and sending them to the protocol.
- `count` - starts immediately after the end of the `reveal` phase, at the beginning of the next 90s voting window. Combining each attestation provider's masked Merkle root with the corresponding revealed random, original Merkle roots of all attestation providers are obtained. The protocol finds the majority Merkle root and declares this as the confirmed attestation (confirmed Merkle root). The majority threshold is at the moment set as 50%+ of all possible votes (the set of all attestation providers is known in advance). In case there is no majority Merkle root, the voting round has failed and no attestation request from that round gets confirmed. Users can resubmit requests in later rounds.

Next: [State connector contract](./state-connector-contract.md)