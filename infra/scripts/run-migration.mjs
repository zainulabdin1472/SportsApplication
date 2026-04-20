import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { parse } from "pg-connection-string";
import dns from "node:dns/promises";
import pg from "pg";

loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), "apps/api/.env") });

const __dirname = dirname(fileURLToPath(import.meta.url));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "DATABASE_URL is missing. Add it to `.env` (repo root) or `apps/api/.env` — copy the Postgres URI from Supabase → Project Settings → Database (include ?sslmode=require)."
  );
  process.exit(1);
}

const sqlPath = join(__dirname, "../supabase/migrations/0001_initial_marketplace.sql");
const sql = readFileSync(sqlPath, "utf8");

async function buildClientConfig(connectionString) {
  const parsed = parse(connectionString);
  const host = parsed.host;
  if (!host) {
    throw new Error("DATABASE_URL must include a host.");
  }

  const ssl = connectionString.includes("supabase.co") ? { rejectUnauthorized: false } : undefined;
  const base = {
    user: parsed.user,
    password: parsed.password,
    port: parsed.port ? Number(parsed.port) : 5432,
    database: parsed.database,
    ssl
  };

  try {
    await dns.lookup(host);
    return { ...base, host };
  } catch {
    const ipv4 = await dns.resolve4(host).catch(() => []);
    if (ipv4.length > 0) {
      return { ...base, host: ipv4[0] };
    }

    const ipv6 = await dns.resolve6(host).catch(() => []);
    if (ipv6.length > 0) {
      return { ...base, host: ipv6[0] };
    }

    throw new Error(
      [
        `Could not resolve database host "${host}" from DATABASE_URL.`,
        "Run `npm run db:migrate` on your own PC (this environment often blocks Supabase DNS),",
        "or paste `infra/supabase/migrations/0001_initial_marketplace.sql` into the Supabase SQL editor."
      ].join(" ")
    );
  }
}

const config = await buildClientConfig(databaseUrl);
const client = new pg.Client(config);

await client.connect();
try {
  await client.query(sql);
  console.log("Migration applied:", sqlPath);
} finally {
  await client.end();
}
