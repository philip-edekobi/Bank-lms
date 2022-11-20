const { Router } = require("express");

let userRouter = Router();

userRouter.get("", (_, res) => {
  const users = res.status(500).json({ users });
});
