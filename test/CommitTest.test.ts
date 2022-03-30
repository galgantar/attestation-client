// yarn c
// yarn hardhat test test/CommitTest.test.ts 

import { singleHash } from "../lib/utils/MerkleTree";
import { CommitTestInstance } from "../typechain-truffle";

const BN = require("bn");

describe("Coston verification test", () => {

  const CommitTest = artifacts.require("CommitTest");
  let commitTest: CommitTestInstance;

  before(async () => {
    commitTest = await CommitTest.new();
  });


  // 2022-03-30T11:02:50.002Z  - global:[debug]: commit data prepared: roundId=139640 merkleTree.root=0x1e5862543fe722cd647c30896f35dc1b91863608db8e6515280aa2df20c39dbf hash=0xd48a5e273a02f926559c9de876d29b210ae1e3d78f02dbbb0
  // 9f88050edaad004
  // 2022-03-30T11:02:50.003Z  - global:[info]: action ............. : Submitting for bufferNumber 139641 (start commit for 139640)
  // 2022-03-30T11:02:50.003Z  - global:[info]: bufferNumber ....... : 139641
  // 2022-03-30T11:02:50.004Z  - global:[info]: maskedMerkleHash ... : 0xcad23c7305e5dbeb31e0ad6119e7473a9b67d5df548cbeae21f2228fcd694dbb
  // 2022-03-30T11:02:50.004Z  - global:[info]: committedRandom .... : 0xfece3f631b8ed6c257b97573d10b860a416e8a27a12e969332921585a02e3e44
  // 2022-03-30T11:02:50.005Z  - global:[info]: revealedRandom ..... : 0xe4f3f3811ed35d37e79ba7c9ed2efde57fc868028ce9fe6aee66be5ffdf86545


  it("Should check the commit for buffer 139641", async () => {

    let merkleRoot = "0x1e5862543fe722cd647c30896f35dc1b91863608db8e6515280aa2df20c39dbf";
    let maskedMerkleRoot = "0xcad23c7305e5dbeb31e0ad6119e7473a9b67d5df548cbeae21f2228fcd694dbb";
    let committedRandom = "0xfece3f631b8ed6c257b97573d10b860a416e8a27a12e969332921585a02e3e44"
    let revealedRandom = "0xd48a5e273a02f926559c9de876d29b210ae1e3d78f02dbbb09f88050edaad004"
    let result = await commitTest.test(merkleRoot, maskedMerkleRoot, committedRandom, revealedRandom);
    console.log(result);
    assert(result === merkleRoot);
  });



  // 2022-03-30T11:04:20.003Z  - global:[debug]: commit data prepared: roundId=139641 merkleTree.root=0xe84423e6626d616f4fa7b795563732f402932ce21039f0125d3cd71372a6d3b1 hash=0xefaaec38c6d0af445d97734686c3e6eeebf65706ab0964aea
  // 648668426ffcb1f
  // 2022-03-30T11:04:20.003Z  - global:[info]: action ............. : Submitting for bufferNumber 139642 (start commit for 139641)
  // 2022-03-30T11:04:20.004Z  - global:[info]: bufferNumber ....... : 139642
  // 2022-03-30T11:04:20.004Z  - global:[info]: maskedMerkleHash ... : 0x7eecfdea4bdce2b1230c4d3d0f4d41ae9657be4bb3094bcfb74b197545918ae
  // 2022-03-30T11:04:20.005Z  - global:[info]: committedRandom .... : 0x7454c2f7a8f586291c23cd1b87a0e8940256821935b5c3928d5acd8112714e2a
  // 2022-03-30T11:04:20.005Z  - global:[info]: revealedRandom ..... : 0xd48a5e273a02f926559c9de876d29b210ae1e3d78f02dbbb09f88050edaad004
  // 2022-03-30T11:04:20.005Z  - global:[debug]: sign Submitting for bufferNumber 139642 (start commit for 139641) wait #67/60
  // 2022-03-30T11:04:20.535Z  - global:[debug]: new block 435814 with 1 event(s)
  // 2022-03-30T11:04:20.536Z  - global:[error]: EVENT RoundFinalised 139642 0x2d8254a033d68c532e3410ac79a09d262fd27be1980b67b33c9451f9e20c044e (commited root 0xefbb53a202d2321b65a5f80909b9731865d2449a98162d2f1d75f05a59317f74)

  it.only("Should check the commit for buffer 139642", async () => {

    let merkleRoot = "0xe84423e6626d616f4fa7b795563732f402932ce21039f0125d3cd71372a6d3b1";
    let maskedMerkleRoot = "0x7eecfdea4bdce2b1230c4d3d0f4d41ae9657be4bb3094bcfb74b197545918ae";
    let committedRandom = "0x7454c2f7a8f586291c23cd1b87a0e8940256821935b5c3928d5acd8112714e2a"
    let revealedRandom = "0xefaaec38c6d0af445d97734686c3e6eeebf65706ab0964aea648668426ffcb1f"
    let result = await commitTest.test(merkleRoot, maskedMerkleRoot, committedRandom, revealedRandom);


    // maskedMerkleRoot2: 0x7eecfdea4bdce2b1230c4d3d0f4d41ae9657be4bb3094bcfb74b197545918ae
    // merkleRoot2: 0x23f84423e6626d616f4fa7b795563732f402932ce21039f0125d3cd71372a6d3b1
    // committedRandom2: 0x7454c2f7a8f586291c23cd1b87a0e8940256821935b5c3928d5acd8112714e2a
    // Unmasked contract 0x914611d28d0c4df57e9b3e7b898ea7407da1e94d18002f6111037ff1636e41ff

    let merkleRootBN = new BN.BigInteger(merkleRoot, 16);
    let randomBN = new BN.BigInteger(revealedRandom, 16);
    let maskedMerkleRootBN = new BN.BigInteger(maskedMerkleRoot, 16);
    let maskedMerkleRoot2 = '0x' + merkleRootBN.xor(randomBN).toString(16);
    let merkleRoot2 = '0x' + maskedMerkleRootBN.xor(randomBN).toString(16);
    let committedRandom2 = singleHash(revealedRandom);

    console.log("maskedMerkleRoot2:",maskedMerkleRoot2);
    console.log("merkleRoot2:",merkleRoot2);
    console.log("committedRandom2:",committedRandom2);
    console.log("Unmasked contract", result);
    assert(result === merkleRoot);
  });

  // 2022-03-30T11:05:50.002Z  - global:[debug]: commit data prepared: roundId=139642 merkleTree.root=0x39b9cb7fd4bd42ced11a83fa09f1a6ebe7d05e53d35e470e19bd0bb1a7328b7d hash=0xb8c85d0b3c4605900105c1526063c70306c22e95fbfa1f98147ea06fa9867045
  // 2022-03-30T11:05:50.002Z  - global:[info]: action ............. : Submitting for bufferNumber 139643 (start commit for 139642)
  // 2022-03-30T11:05:50.004Z  - global:[info]: bufferNumber ....... : 139643
  // 2022-03-30T11:05:50.004Z  - global:[info]: maskedMerkleHash ... : 0x81719674e8fb475ed01f42a8699261e8e11270c628a458960dc3abde0eb4fb38
  // 2022-03-30T11:05:50.004Z  - global:[info]: committedRandom .... : 0x345842159fa1a9a788ddcfb7565074e2dc72271f3e568ac22d096a2e4de38558
  // 2022-03-30T11:05:50.004Z  - global:[info]: revealedRandom ..... : 0xefaaec38c6d0af445d97734686c3e6eeebf65706ab0964aea648668426ffcb1f
  // 2022-03-30T11:05:50.004Z  - global:[debug]: sign Submitting for bufferNumber 139643 (start commit for 139642) wait #68/60
  // 2022-03-30T11:05:50.578Z  - global:[debug]: new block 435881 with 1 event(s)
  // 2022-03-30T11:05:50.579Z  - global:[error]: EVENT RoundFinalised 139643 0x2b047807bde298064971e118794219d874451b9f2af7db5745717abfbfc629a3 (commited root 0x1e5862543fe722cd647c30896f35dc1b91863608db8e6515280aa2df20c39dbf)

  it("Should check the commit for buffer 139643", async () => {

    let merkleRoot = "0x39b9cb7fd4bd42ced11a83fa09f1a6ebe7d05e53d35e470e19bd0bb1a7328b7d";
    let maskedMerkleRoot = "0x81719674e8fb475ed01f42a8699261e8e11270c628a458960dc3abde0eb4fb38";
    let committedRandom = "0x345842159fa1a9a788ddcfb7565074e2dc72271f3e568ac22d096a2e4de38558"
    let revealedRandom = "0xb8c85d0b3c4605900105c1526063c70306c22e95fbfa1f98147ea06fa9867045"
    let result = await commitTest.test(merkleRoot, maskedMerkleRoot, committedRandom, revealedRandom);
    console.log(result);
    assert(result === merkleRoot);

  });

  // 2022-03-30T11:07:20.001Z  - global:[debug]: commit data prepared: roundId=139643 merkleTree.root=0xc0785441d5342e357a8a9d7c6728315c197e84d3405b8eeb8426d1dda55beb6a hash=0xd1574d705e00e796726010d1db5aa7474bdf7d8dc95cf2cb20f3c1d1c9094808
  // 2022-03-30T11:07:20.002Z  - global:[info]: action ............. : Submitting for bufferNumber 139644 (start commit for 139643)
  // 2022-03-30T11:07:20.002Z  - global:[info]: bufferNumber ....... : 139644
  // 2022-03-30T11:07:20.002Z  - global:[info]: maskedMerkleHash ... : 0x112f19318b34c9a308ea8dadbc72961b52a1f95e89077c20a4d5100c6c52a362
  // 2022-03-30T11:07:20.002Z  - global:[info]: committedRandom .... : 0x81aa36625ae4efa78069fcecff9dfc7e081a51795d2edd2960511fcf380386e2
  // 2022-03-30T11:07:20.002Z  - global:[info]: revealedRandom ..... : 0xb8c85d0b3c4605900105c1526063c70306c22e95fbfa1f98147ea06fa9867045

  it("Should check the commit for buffer 139644", async () => {
    let commitTest = await CommitTest.new();
    let merkleRoot = "0xc0785441d5342e357a8a9d7c6728315c197e84d3405b8eeb8426d1dda55beb6a";
    let maskedMerkleRoot = "0x112f19318b34c9a308ea8dadbc72961b52a1f95e89077c20a4d5100c6c52a362";
    let committedRandom = "0x81aa36625ae4efa78069fcecff9dfc7e081a51795d2edd2960511fcf380386e2"
    let revealedRandom = "0xd1574d705e00e796726010d1db5aa7474bdf7d8dc95cf2cb20f3c1d1c9094808"
    let result = await commitTest.test(merkleRoot, maskedMerkleRoot, committedRandom, revealedRandom);
    console.log(result);
    assert(result === merkleRoot);

  });



  // 2022-03-30T11:08:50.003Z  - global:[debug]: commit data prepared: roundId=139644 merkleTree.root=0xc466aa49340437cd911475e4f29ad90f6e51b396d88bf5f77930aa94fa25d662 hash=0x8887d5644e6769138090ffd0678b5a08474d33d4bcbfab5a59cdb52d3ab820b3
  // 2022-03-30T11:08:50.003Z  - global:[info]: action ............. : Submitting for bufferNumber 139645 (start commit for 139644)
  // 2022-03-30T11:08:50.003Z  - global:[info]: bufferNumber ....... : 139645
  // 2022-03-30T11:08:50.003Z  - global:[info]: maskedMerkleHash ... : 0x4ce17f2d7a635ede11848a3495118307291c804264345ead20fd1fb9c09df6d1
  // 2022-03-30T11:08:50.004Z  - global:[info]: committedRandom .... : 0x4f9b422ff1cd3d60279525cb10e0dcc5ce0994a0373547919ed6c4a8251eda99
  // 2022-03-30T11:08:50.004Z  - global:[info]: revealedRandom ..... : 0xd1574d705e00e796726010d1db5aa7474bdf7d8dc95cf2cb20f3c1d1c9094808

  it("Should check the commit for buffer 139645", async () => {
    let commitTest = await CommitTest.new();
    let merkleRoot = "0xc466aa49340437cd911475e4f29ad90f6e51b396d88bf5f77930aa94fa25d662";
    let maskedMerkleRoot = "0x4ce17f2d7a635ede11848a3495118307291c804264345ead20fd1fb9c09df6d1";
    let committedRandom = "0x4f9b422ff1cd3d60279525cb10e0dcc5ce0994a0373547919ed6c4a8251eda99"
    let revealedRandom = "0x8887d5644e6769138090ffd0678b5a08474d33d4bcbfab5a59cdb52d3ab820b3"
    let result = await commitTest.test(merkleRoot, maskedMerkleRoot, committedRandom, revealedRandom);
    console.log(result);
    assert(result === merkleRoot);

  });

  // 2022-03-30T11:10:20.001Z  - global:[debug]: commit data prepared: roundId=139645 merkleTree.root=0x709a8870630096effc0d8cc66ad6b4c246bdba493dcf290290be9ca9f5d7516c hash=0xa3c98ff4823d0f56ebb8ec015e0d42493b0d663c2914fca8527c4e2c10aacd0c
  // 2022-03-30T11:10:20.001Z  - global:[info]: action ............. : Submitting for bufferNumber 139646 (start commit for 139645)
  // 2022-03-30T11:10:20.002Z  - global:[info]: bufferNumber ....... : 139646
  // 2022-03-30T11:10:20.002Z  - global:[info]: maskedMerkleHash ... : 0xd3530784e13d99b917b560c734dbf68b7db0dc7514dbd5aac2c2d285e57d9c60
  // 2022-03-30T11:10:20.002Z  - global:[info]: committedRandom .... : 0x035504e3fe28dc9cd500653b935ff9d0aabe584e95e9ef499ae7a2f421fa4485
  // 2022-03-30T11:10:20.002Z  - global:[info]: revealedRandom ..... : 0x8887d5644e6769138090ffd0678b5a08474d33d4bcbfab5a59cdb52d3ab820b3


  // --------------


  // 2022-03-30T11:50:50.002Z  - global:[debug]: commit data prepared: roundId=139672 merkleTree.root=0x732697f522b6a189ebd0ff65ed66840f0c8823f6acb7e44da2aecc28e9d28a30 hash=0xcfde33daab7747de161366cb5fffd9817d1ccdf1be46fba820873fc7eaab14d1
  // 2022-03-30T11:50:50.002Z  - global:[info]: action ............. : Submitting for bufferNumber 139673 (start commit for 139672)
  // 2022-03-30T11:50:50.003Z  - global:[info]: bufferNumber ....... : 139673
  // 2022-03-30T11:50:50.003Z  - global:[info]: maskedMerkleHash ... : 0xbcf8a42f89c1e657fdc399aeb2995d8e7194ee0712f11fe58229f3ef03799ee1
  // 2022-03-30T11:50:50.003Z  - global:[info]: committedRandom .... : 0x7c13c3f9d06f77a9133ffc305a5f56126b6a14312d515a39b09a07d0746a5081
  // 2022-03-30T11:50:50.003Z  - global:[info]: revealedRandom ..... : 0xfa94dc211078e549b0ca906477c01b2782c29e85e45aeb39d935c27e78a4ac23
  // 2022-03-30T11:50:51.184Z  - global:[error]: EVENT RoundFinalised 139673 0xe96be06303eb1c54f252a39791f3b9facedc3f6b89e3858c4b561ec8710a222e (commited root 0x5d96b32998c743d3173311cf8b997c00735536b0d0da629773186d48e977ae18
  //   )  

  it("Should check the commit for buffer 139673", async () => {

    let merkleRoot = "0x732697f522b6a189ebd0ff65ed66840f0c8823f6acb7e44da2aecc28e9d28a30";
    let maskedMerkleRoot = "0xbcf8a42f89c1e657fdc399aeb2995d8e7194ee0712f11fe58229f3ef03799ee1";
    let committedRandom = "0x7c13c3f9d06f77a9133ffc305a5f56126b6a14312d515a39b09a07d0746a5081"
    let revealedRandom = "0xcfde33daab7747de161366cb5fffd9817d1ccdf1be46fba820873fc7eaab14d1"
    let result = await commitTest.test(merkleRoot, maskedMerkleRoot, committedRandom, revealedRandom);
    console.log(result);
    assert(result === merkleRoot);
  });

  //   2022-03-30T11:52:20.001Z  - global:[debug]: commit data prepared: roundId=139673 merkleTree.root=0x8d6b827eae831197dc4e560b39b83ec57ce6a4b00f1bebbfade8354fb2d47e0e hash=0x4accbd736cbf35ecdd5c54544b32b76c0630411f1a337938b2eed3b55c1a90a6
  // 2022-03-30T11:52:20.002Z  - global:[info]: action ............. : Submitting for bufferNumber 139674 (start commit for 139673)
  // 2022-03-30T11:52:20.002Z  - global:[info]: bufferNumber ....... : 139674
  // 2022-03-30T11:52:20.003Z  - global:[info]: maskedMerkleHash ... : 0xc7a73f0dc23c247b0112025f728a89a97ad6e5af152892871f06e6faeeceeea8
  // 2022-03-30T11:52:20.003Z  - global:[info]: committedRandom .... : 0x7a28bf6657fb52d3510e4e7cfc8295b6eacfb5c4d13c20fd48b26e709121e0c9
  // 2022-03-30T11:52:20.004Z  - global:[info]: revealedRandom ..... : 0xcfde33daab7747de161366cb5fffd9817d1ccdf1be46fba820873fc7eaab14d1
  // });
  // 2022-03-30T11:52:20.512Z  - global:[error]: EVENT RoundFinalised 139674 0xd1c21bda913c280b440398fe3e8d25399cf9121006ddfd7882d211d7346a86ca (commited root 0xf6d1cfb26536536a133369b8a5c8e1e9adde7b863e2b790858a83d344852aca3)

  it("Should check the commit for buffer 139674", async () => {

    let merkleRoot = "0x8d6b827eae831197dc4e560b39b83ec57ce6a4b00f1bebbfade8354fb2d47e0e";
    let maskedMerkleRoot = "0xc7a73f0dc23c247b0112025f728a89a97ad6e5af152892871f06e6faeeceeea8";
    let committedRandom = "0x7a28bf6657fb52d3510e4e7cfc8295b6eacfb5c4d13c20fd48b26e709121e0c9"
    let revealedRandom = "0x4accbd736cbf35ecdd5c54544b32b76c0630411f1a337938b2eed3b55c1a90a6"
    let result = await commitTest.test(merkleRoot, maskedMerkleRoot, committedRandom, revealedRandom);
    console.log(result);
    assert(result === merkleRoot);
  });

  // 2022-03-30T11:53:50.002Z  - global:[debug]: commit data prepared: roundId=139674 merkleTree.root=0x165829343d00f97d2094be72e1fd69e6cea6efbf28ad14e5854d2a11e1bae5ed hash=0x59573f164ab6387728b1fb1a3e5fb020eaf481fd477dc92c016b554ade6a9fe6
  // 2022-03-30T11:53:50.002Z  - global:[info]: action ............. : Submitting for bufferNumber 139675 (start commit for 139674)
  // 2022-03-30T11:53:50.003Z  - global:[info]: bufferNumber ....... : 139675
  // 2022-03-30T11:53:50.003Z  - global:[info]: maskedMerkleHash ... : 0x4f0f162277b6c10a08254568dfa2d9c624526e426fd0ddc984267f5b3fd07a0b
  // 2022-03-30T11:53:50.003Z  - global:[info]: committedRandom .... : 0x79d26416aa92e4feeaf5e0722ed9f0197bc5d84459d5d4353043dd0e1eb564fc
  // 2022-03-30T11:53:50.003Z  - global:[info]: revealedRandom ..... : 0x4accbd736cbf35ecdd5c54544b32b76c0630411f1a337938b2eed3b55c1a90a6
  // 2022-03-30T11:53:50.003Z  - global:[debug]: sign Submitting for bufferNumber 139675 (start commit for 139674) wait #100/96
  // 2022-03-30T11:53:50.332Z  - global:[debug]: new block 438077 with 1 event(s)
  // 2022-03-30T11:53:51.219Z  - global:[debug]: new block 438078 with 1 event(s)
  // 2022-03-30T11:53:51.220Z  - global:[error]: EVENT RoundFinalised 139675 0x8cc209751dc1b01779b09d95345505ed9b07bef189711c88c9fba3a39f2e990e (commited root 0x732697f522b6a189ebd0ff65ed66840f0c8823f6acb7e44da2aecc28e9d28a30)


});