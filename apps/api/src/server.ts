import "dotenv/config";
import { buildApp } from "./app.js";
import { env } from "./config/env.js";

const app = buildApp();

app.listen(env.PORT, () => {
  console.log(`sportsapp api listening on ${env.PORT}`);
});
