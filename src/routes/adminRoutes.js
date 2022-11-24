"use strict";
const { Router } = require("express");
const jwt = require("jsonwebtoken");

let adminRouter = Router();

const greenData = {
  id: true,
  fname: true,
  lname: true,
  email: true,
};

adminRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
      select: {
        ...greenData,
        password: true,
      },
    });

    if (!admin)
      return res.status(404).json({ success: false, error: "User not found" });

    const passwordMatch = password === admin.password;

    if (!passwordMatch)
      return res
        .status(400)
        .json({ success: false, error: "incorrect password" });

    // create jwt token
    const token = jwt.sign({ id: admin.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return res.cookie("token", { token }).json({
      success: true,
      message: "Login successful",
      data: { admin: { ...admin, password: null } },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error });
  }
});

module.exports = adminRouter;
