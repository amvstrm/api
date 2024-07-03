import app from './src/app.js';
import { env } from './src/utils/env.js';

const port = env.port || 8080;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  if (env.data.BLOCK_WITH_CORS === "true") {
    console.log("Warning: This will block every request even from the localhost. Please manually add domain to the environment variable 'ALLOWLIST'.");
  }
  /* eslint-enable no-console */
});
