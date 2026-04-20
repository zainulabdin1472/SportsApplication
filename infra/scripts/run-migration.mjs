import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { parse } from "pg-connection-string";
import dns from "node:dns/promises";
import pg from "pg";

loadEnv({ path: resolve(process.cwd(), "apps/api/.env") });

const __dirname = dirname(fileURLToPath(import.meta.url));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required (postgresql://... with sslmode=require).");
  process.exit(1);
}

const sqlPath = join(__dirname, "../supabase/migrations/0001_initial_marketplace.sql");
const sql = readFileSync(sqlPath, "utf8");

async function resolveConnection(databaseUrl) {
  const parsed = parse(databaseUrl);
  const host = parsed.host;
  if (!host) {
    return { connectionString: databaseUrl };
  }

  try {
    await dns.lookup(host);
    return { connectionString: databaseUrl };
  } catch {
    // Some networks return only AAAA for `db.<ref>.supabase.co`; Node may fail generic lookup.
    const ipv4 = await dns.resolve4(host).catch(() => []);
    if (ipv4.length > 0) {
      const next = new URL(databaseUrl.replace(/^postgres(ql)?:/i, "http:"));
      next.hostname = ipv4[0];
      return { connectionString: next.toString().replace(/^http:/i, "postgres:") };
    }

    const ipv6 = await dns.resolve6(host).catch(() => []);
    if (ipv6.length > 0) {
      const rebuilt = new URL(databaseUrl.replace(/^postgres(ql)?:/i, "http:"));
      rebuilt.hostname = `[${ipv6[0]}]`;
      return { connectionString: rebuilt.toString().replace(/^http:/i, "postgres:") };
    }

    throw new Error(
      [
        `Could not resolve database host "${host}" from DATABASE_URL.`,
        "Run this command on your machine (outside restricted sandboxes), or paste",
        "`infra/supabase/migrations/0001_initial_marketplace.sql` into the Supabase SQL editor."
      ].join(" ")
    );
  }
}

const resolved = await resolveConnection(databaseUrl);
const client = new pg.Client({
  ...resolved,
  ssl: databaseUrl.includes("supabase.co") ? { rejectUnauthorized: false } : undefined
});

await client.connect();
try {
  await client.query(sql);
  console.log("Migration applied:", sqlPath);
} finally {
  await client.end();
}
