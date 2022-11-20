"use strict";
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const PORT = parseInt(process.env.PORT, 10);

function setupRoutes(app) {
  app.use();
}

module.exports.startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );

  setupRoutes(app);

  const server = http.createServer(app);

  server.listen(PORT, () =>
    console.log(`server is listening on port: ${PORT}`)
  );
};
