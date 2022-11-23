"use strict";
const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");

const { generateAccountNumber } = require("../helpers");

let userRouter = Router();
const prisma = new PrismaClient();

userRouter.get("", async (_, res) => {
  try {
    const users = await prisma.customer.findMany();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

userRouter.get(":id", async (req, res) => {
  try {
    const user = await prisma.customer.findUnique({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = userRouter;
