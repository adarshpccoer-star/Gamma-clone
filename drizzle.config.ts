import type { Config } from "drizzle-kit";
import * as schema from "@/db/schema"
export default {
  schema: "./db/schema/index.ts", 
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;