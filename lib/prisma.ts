import "temporal-polyfill/global";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract, FieldInputTypes } from "@/prisma/schema";
import contractJson from "@/prisma/schema.json" with { type: "json" };

export const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

type InstantInput = FieldInputTypes["public"]["User"]["createdAt"];

export function nowInstant(): InstantInput {
  const temporal = (
    globalThis as typeof globalThis & {
      Temporal: { Now: { instant: () => InstantInput } };
    }
  ).Temporal;

  return temporal.Now.instant();
}
