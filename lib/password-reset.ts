import crypto from "crypto";

export function createPasswordResetToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function createPasswordResetTokenHash(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export type TemporalInstantLike = {
  epochMilliseconds: number;
};

export function instantFromEpochMilliseconds(
  epochMilliseconds: number,
): TemporalInstantLike {
  return (globalThis as typeof globalThis & {
    Temporal: {
      Instant: {
        fromEpochMilliseconds: (value: number) => TemporalInstantLike;
      };
    };
  }).Temporal.Instant.fromEpochMilliseconds(epochMilliseconds);
}

export function instantIsExpired(value: unknown) {
  const epochMilliseconds =
    typeof value === "object" &&
    value !== null &&
    "epochMilliseconds" in value &&
    typeof value.epochMilliseconds === "number"
      ? value.epochMilliseconds
      : new Date(String(value)).getTime();

  return !Number.isFinite(epochMilliseconds) || epochMilliseconds < Date.now();
}
