"use strict";
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

module.exports.userAuth = async function (req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(403).json({ error: "UNAUTHORIZED REQUEST" });
    }

    const verify = jwt.verify(token.token, process.env.SECRET_KEY);

    if (!verify)
      return res.status(403).json({ success: false, error: "Access Denied" });

    req.user = await prisma.customer.findUnique({
      where: {
        id: verify.id,
      },
    });

    next();
  } catch (error) {
    return res.status(403).json({ error: "UNAUTHORIZED REQUEST" });
  }
};

module.exports.adminAuth = async function () {};
