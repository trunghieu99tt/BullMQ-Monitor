import "reflect-metadata";
import { APP_PORT } from "./config/env";
import app from "./app";

app.listen(APP_PORT, () => {
  console.log("server is running on port " + APP_PORT);
});
