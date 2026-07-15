import createApp from "./app.js";
import config from "./config/index.js";
import { initSocket } from "./socket.js";

const app = createApp();
const port = config.PORT || 5000;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`EZStore backend listening on http://localhost:${port}`);
});

initSocket(server, {
  origin: [config.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
});
