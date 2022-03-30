import { AttesterCredentials } from "../attester/AttesterClientConfiguration";
import { DBState } from "../entity/indexer/dbState";
import { readCredentials } from "../utils/config";
import { DatabaseService } from "../utils/databaseService";
import { AttLogger } from "../utils/logger";
import { getUnixEpochTimestamp, secToHHMMSS } from "../utils/utils";
import { AlertBase, AlertRestartConfig, AlertStatus } from "./AlertBase";
import { AlertConfig } from "./alerts";

export class IndexerAlert extends AlertBase {
    static dbService: DatabaseService;

    config: AlertConfig;

    constructor(name: string, logger: AttLogger, config: AlertConfig) {
        super(name, logger, new AlertRestartConfig(config.timeRestart, config.indexerRestart.replace("<name>", name)));

        this.config = config;

        if (!IndexerAlert.dbService) {

            const credentials = readCredentials<AttesterCredentials>("attester");

            IndexerAlert.dbService = new DatabaseService(logger, credentials.indexerDatabase, "indexer");
        }
    }

    async initialize() {
        await IndexerAlert.dbService.waitForDBConnection();
    }

    async check(): Promise<AlertStatus> {

        const res = new AlertStatus();
        res.name = `indexer ${this.name}`;

        const resState = await IndexerAlert.dbService.manager.findOne(DBState, { where: { name: `${this.name}_state` } });

        if (resState === undefined) {
            res.state = "state data not available";
            return res;
        }

        const now = getUnixEpochTimestamp();

        res.state = resState.valueString;
        const late = now - resState.timestamp;

        res.timeLate = late;

        if (resState.valueString == "sync") {
            if (resState.valueNumber > 0) {
                res.comment = `ETA ${secToHHMMSS(resState.valueNumber)}`;
                res.status = "sync";

                if (late > this.config.timeLate) {
                    res.status = "late";
                }

                if (late > this.config.timeDown) {
                    res.status = "down";
                }

            }
            else {
                res.comment = "invalid response";
                res.status = "down";
            }
        }
        else if (resState.valueString == "running") {
            res.comment = `processed blocks ${resState.valueNumber}`;
            res.status = "running";

            if (late > this.config.timeLate) {
                res.status = "late";
            }

            if (late > this.config.timeDown) {
                res.status = "down";
            }
        }

        if (late > this.restartConfig.time) {
            if( await this.restart() ) {
                res.comment = "^r^Wrestart^^";
            }
        }

        return res;
    }
}
