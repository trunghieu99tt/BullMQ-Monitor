import "reflect-metadata";
import { APP_PORT } from "./config/env";
import app from "./app";
import { initializeQueues } from "./initQueue";

app.listen(APP_PORT, () => {
  initializeQueues();
  console.log("server is running on port " + APP_PORT);
});
