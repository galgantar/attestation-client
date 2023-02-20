import { Attestation } from "../Attestation";
import { AttestationStatus } from "../types/AttestationStatus";
import { SourceLimiterConfig } from "../configs/SourceLimiterConfig";
import { AttLogger } from "../../utils/logging/logger";

export interface EventValidateAttestation {
  (attestation: Attestation): void;
}

/**
 * Handles validation of attestation request for a specific round and on a specific data source
 */
export class SourceLimiter {
  config: SourceLimiterConfig;

  logger: AttLogger;

  // Rate limit weight counter
  private currentRoundWeight = 0;

  constructor(config: SourceLimiterConfig, logger: AttLogger) {
    this.logger = logger;
    this.config = config;
    // this.config = this.round.attestationRoundManager.attestationConfigManager.getSourceLimiterConfig(sourceId, round.roundId);
  }

  /**
   * Checks for rate limit by weighted call limitations.
   * All attestations over the rate limit are rejected with attestation status 'overLimit'.
   * @param attestation 
   * @returns true if validations should be performed.
   */
  canProceedWithValidation(attestation: Attestation): boolean {
    if (this.currentRoundWeight >= this.config.maxTotalRoundWeight) {
      attestation.status = AttestationStatus.overLimit;
      return false;
    }

    const typeConfig = this.config.attestationTypes.get(attestation.data.type);

    if (!typeConfig) {
      this.logger.error2(`missing source ${attestation.data.sourceId} config for attestation type (${attestation.data.type})`);
      attestation.status = AttestationStatus.error;
      return false;
    }

    this.currentRoundWeight += typeConfig!.weight;

    return true;
  }
}