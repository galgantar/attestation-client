// yarn test test/utils/internetTime.test.ts

import { assert } from "chai";
import { getTimeSec, getTimeMs } from "../../src/utils/helpers/internetTime";
import { getTestFile } from "../test-utils/test-utils";

describe(`Internet time (${getTestFile(__filename)})`, () => {
  it("Should get time in milliseconds", () => {
    const timeMil = getTimeMs();
    assert(timeMil > 1666622201459);
  });

  it("Should get time in seconds", () => {
    const timeSec = getTimeSec();
    assert(timeSec > 1666622201);
  });
});
