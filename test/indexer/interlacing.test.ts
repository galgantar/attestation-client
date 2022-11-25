import { ChainType } from "@flarenetwork/mcc";
import { Interlacing } from "../../lib/indexer/interlacing";
import { DatabaseService, DatabaseSourceOptions } from "../../lib/utils/databaseService";
import { getGlobalLogger, globalTestLogger } from "../../lib/utils/logger";
import { expect } from "chai";
import { DBTransactionBase, DBTransactionBTC0, DBTransactionBTC1 } from "../../lib/entity/indexer/dbTransaction";
import { afterEach } from "mocha";
const utils = require("../../lib/utils/utils");
import sinon from "sinon";
import { promAugTxBTC0, promAugTxBTC1, promAugTxBTCALt0, promAugTxBTCAlt1 } from "../mockData/indexMock";
import { DBBlockBTC } from "../../lib/entity/indexer/dbBlock";

describe("interlacing", () => {
  const databaseConnectOptions = new DatabaseSourceOptions();
  databaseConnectOptions.database = process.env.DATABASE_NAME2;
  databaseConnectOptions.username = process.env.DATABASE_USERNAME;
  databaseConnectOptions.password = process.env.DATBASE_PASS;
  const dataService = new DatabaseService(globalTestLogger, databaseConnectOptions);

  let interlacing = new Interlacing();

  let augTx0: DBTransactionBase;
  let augTxAlt0: DBTransactionBase;
  let augTx1: DBTransactionBase;
  let augTxAlt1: DBTransactionBase;

  before(async () => {
    augTx0 = await promAugTxBTC0;
    augTxAlt0 = await promAugTxBTCALt0;
    augTx1 = await promAugTxBTC1;
    augTxAlt1 = await promAugTxBTCAlt1;

    if (!dataService.dataSource.isInitialized) {
      await dataService.init();
    }

    //start with empty tables
    for (let i = 0; i < 2; i++) {
      const queryRunner = dataService.connection.createQueryRunner();
      const tableName = `btc_transactions${i}`;
      const table = await queryRunner.getTable(tableName);
      await queryRunner.dropTable(table);
      await queryRunner.release();
    }
  });

  beforeEach(async () => {
    if (dataService.dataSource.isInitialized) {
      await dataService.dataSource.destroy();
    }
    await dataService.init();

    // await dataService.manager.save(augTx1);
    // await interlacing.initialize(globalTestLogger, dataService, ChainType.BTC, 3600, 10);
  });

  afterEach(async () => {
    await interlacing.resetAll();
    if (dataService.dataSource.isInitialized) {
      await dataService.dataSource.destroy();
    }
  });

  // after(async ())

  it("should get active index for empty tables", async () => {
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    expect(interlacing.activeIndex).to.be.equal(0);
  });

  it("should get active index for non-empty table", async () => {
    await dataService.dataSource.manager.save(augTx1);
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    expect(interlacing.activeIndex).to.be.equal(1);
  });

  it("should reset all", async () => {
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    expect(interlacing.activeIndex).to.be.equal(0);
  });

  it("should get index from later database #1", async () => {
    await dataService.dataSource.manager.save(augTx0);
    await dataService.dataSource.manager.save(augTxAlt1);
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    expect(interlacing.activeIndex).to.be.equal(1);
  });

  it("should get index from later database #2", async () => {
    await dataService.dataSource.manager.save(augTx1);
    await dataService.dataSource.manager.save(augTxAlt0);
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    expect(interlacing.activeIndex).to.be.equal(0);
  });

  it("should update initial", async () => {
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    let res = await interlacing.update(1668574798, 763380);
    expect(res).to.be.false;
  });

  it("should get indexer transaction classes", async () => {
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    let res = interlacing.DBTransactionClasses[0];
    expect(res).to.be.eq(DBTransactionBTC0);
  });

  it("should get block indexer tables", async () => {
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    let res = interlacing.DBBlockClass;
    expect(res).to.be.eq(DBBlockBTC);
  });

  it("should update", async () => {
    await dataService.dataSource.manager.save(augTx0);
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    let res = await interlacing.update(16685747980, 7633800);
    expect(res).to.be.true;
    expect(interlacing.activeIndex).to.be.equal(1);
  });

  it("Should wait for table to unlock update", async function () {
    await dataService.dataSource.manager.save(augTx0);
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);

    interlacing.update(16685757980, 7643800);
    const spy = sinon.spy(utils, "sleepms");
    await interlacing.update(16685747980, 7633800);
    expect(spy.calledWith(1)).to.be.true;
    sinon.restore();
  });

  it("Should wait for table to unlock resetAll", async function () {
    await dataService.dataSource.manager.save(augTx0);
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    interlacing.resetAll();
    const spy = sinon.spy(utils, "sleepms");
    expect(spy.calledWith(1)).to.be.false;
    await interlacing.resetAll();
    expect(spy.calledWith(1)).to.be.true;
  });

  it("should not update", async () => {
    await dataService.dataSource.manager.save(augTx0);
    await interlacing.initialize(getGlobalLogger(), dataService, ChainType.BTC, 3600, 10);
    let res = await interlacing.update(10, 10);
    expect(res).to.be.false;
    // expect(interlacing.activeIndex).to.be.equal(0);
  });
});
