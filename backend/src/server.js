import dotenv from "dotenv";
import createApp from "./app.js";
import config from "./config/index.js";

dotenv.config();

const app = createApp(config);

const port = config.PORT || 5000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`EZStore backend listening on http://localhost:${port}`);
});
