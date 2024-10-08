const express = require('express');
const { ServerConfig, Logger, QueueConfig } = require('./config');
const apiRoutes = require('./routes');
const CRON = require('./utils/common/cron-jobs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/bookingService/api", apiRoutes);
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Port is running on ${ServerConfig.PORT}`);
  Logger.info("Successfully started the server", {});
  CRON();
  await QueueConfig.connectQueue();
  Logger.info("Queue Connected", {})
});