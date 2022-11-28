"use strict";
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const loanRoutes = require("./routes/loanRoutes");

const PORT = parseInt(process.env.PORT, 10);

//function where all the routes are registered, makes all routing logic live in one place
function setupRoutes(app) {
  app.use("/api/v1/user/", userRoutes);
  app.use("/api/v1/admin/", adminRoutes);
  app.use("/api/v1/loan", loanRoutes);
}

module.exports.startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  setupRoutes(app);

  const server = http.createServer(app);

  server.listen(PORT, () =>
    console.log(`server is listening on port: ${PORT}`)
  );
};
