import { base64ToHex, IAlgoGetBlockRes, IAlgoGetFullTransactionRes, IUtxoGetBlockRes, RPCInterface, txIdToHexNo0x } from "flare-mcc";
import { IUtxoGetFullTransactionRes } from "flare-mcc/dist/types/utxoTypes";
import { DBTransactionBase } from "../../entity/dbTransaction";


export async function augmentTransactionAlgo(client: RPCInterface, block: IAlgoGetBlockRes, txData: IAlgoGetFullTransactionRes): Promise<DBTransactionBase> {
   const res = new DBTransactionBase();
   res.blockNumber = block.round;
   res.chainType = client.chainType;

   // Algo specific conversion of transaction hashes to hex 
   res.transactionId = txIdToHexNo0x(txData.id);

   // If there is note other
   res.paymentReference = base64ToHex(txData.note || "")
   res.timestamp = txData.roundTime || 0

   res.response = JSON.stringify(txData)
   return res as DBTransactionBase
}

export async function augmentTransactionUtxo(client: RPCInterface, block: IUtxoGetBlockRes, txData: IUtxoGetFullTransactionRes): Promise<DBTransactionBase> {
   const res = new DBTransactionBase();
   res.blockNumber = block.height;
   res.chainType = client.chainType;
   res.transactionId = txData.hash;

   const paymentRef = client.getTransactionRefFromTransaction(txData)
   if (paymentRef.length === 1) {
      res.paymentReference = paymentRef[0]
   }
   // we get block number on top level when we add transactions from indexer into processing queue
   // res.blockNumber = await getRandom();

   res.timestamp = txData.blocktime

   res.response = JSON.stringify(txData)
   return res as DBTransactionBase
}

export async function augmentTransactionXrp(client: RPCInterface, block: any, txData: any): Promise<DBTransactionBase> {
   const res = new DBTransactionBase();
   res.blockNumber = block.result.ledger_index;
   res.chainType = client.chainType;
   res.transactionId = txData.hash;

   res.response = JSON.stringify(txData)
   return res as DBTransactionBase
}