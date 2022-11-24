"use strict";
const { Router } = require("express");
const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { generateAccountNumber } = require("../helpers");
const { userAuth } = require("../middleware/authMiddleWare");
const {
  signupValidator,
  loginValidator,
  updateValidator,
  updatePasswordValidator,
} = require("../middleware/validateUser");
const prisma = require("../lib/prisma");

require("dotenv").config();

const greenData = {
  id: true,
  fname: true,
  lname: true,
  acc_num: true,
  email: true,
  phone_num: true,
  address: true,
  gender: true,
  dob: true,
}; // allowed fields for the user from the database

let userRouter = Router();

userRouter.get("", async (_, res) => {
  try {
    const users = await prisma.customer.findMany({
      select: greenData,
    });
    return res.status(200).json({ success: true, data: { users } });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

userRouter.get("/details", userAuth, async (req, res) => {
  try {
    if (!req.user)
      return res.status(403).json({ success: false, error: "Access Denied" });

    const user = await prisma.customer.findUnique({
      where: {
        id: parseInt(req.user.id, 10),
      },
      select: greenData,
    });

    return res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

userRouter.post("", signupValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // extract user details
    const { fname, lname, email, password, phone_num, address, gender, dob } =
      req.body;

    // check if user exists
    const existingUser = await prisma.customer.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser)
      return res
        .status(400)
        .json({ success: false, error: "user already exists" });

    //hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //gen acc num
    const acc_num = generateAccountNumber();

    //create user
    const customer = await prisma.customer.create({
      data: {
        fname,
        lname,
        email,
        password: hashedPassword,
        acc_num,
        phone_num,
        address,
        gender,
        dob,
      },
    });

    // create jwt
    const token = jwt.sign({ id: customer.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return res.cookie("token", { token }).json({
      success: true,
      message: "User registered successfully",
      data: {
        customer: {
          id: customer.id,
          fname,
          lname,
          email,
          acc_num: customer.acc_num,
          phone_num,
          address,
          gender,
          dob,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

userRouter.post("/login", loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // extract login details
    const { acc_num, password } = req.body;

    //check if user exists and compare passwords
    const customer = await prisma.customer.findUnique({
      where: {
        acc_num: parseInt(acc_num, 10),
      },
      select: {
        ...greenData,
        password: true,
      },
    });

    if (!customer)
      return res.status(404).json({ success: false, error: "User not found" });

    const passwordMatch = await bcrypt.compare(password, customer.password);

    if (!passwordMatch)
      return res
        .status(400)
        .json({ success: false, error: "incorrect password" });

    // create jwt token
    const token = jwt.sign({ id: customer.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return res.cookie("token", { token }).json({
      success: true,
      message: "Login successful",
      data: { customer: { ...customer, password: null } },
    });

    //return user
  } catch (error) {
    return res.status(500).json({ error });
  }
});

userRouter.patch("", userAuth, updateValidator, async (req, res) => {
  req.body = matchedData(req, { locations: ["body"], includeOptionals: true });
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.user)
    return res.status(403).json({ success: false, error: "Access Denied" });

  try {
    const user = await prisma.customer.findUnique({
      where: {
        id: parseInt(req.user.id, 10),
      },
    });

    const newUser = await prisma.customer.update({
      where: {
        id: parseInt(req.user.id, 10),
      },
      data: {
        ...user,
        ...req.body,
      },
      select: greenData,
    });

    return res.status(200).json({ success: true, data: { user: newUser } });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

userRouter.patch(
  "/password",
  userAuth,
  updatePasswordValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.user)
      return res.status(403).json({ success: false, error: "Access Denied" });

    try {
      const newPassword = req.body.newPassword;
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(newPassword, salt);

      const updatedUser = await prisma.customer.update({
        where: {
          id: parseInt(req.user.id, 10),
        },
        data: {
          password: hash,
        },
        select: greenData,
      });

      return res
        .status(200)
        .json({ success: true, data: { user: { updatedUser } } });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  }
);

userRouter.delete("", userAuth, async (req, res) => {
  if (!req.user)
    return res.status(403).json({ success: false, error: "Access Denied" });

  try {
    const delUser = await prisma.customer.delete({
      where: {
        id: req.user.id,
      },

      select: greenData,
    });

    return res.status(200).json({ success: true, customer: delUser });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

module.exports = userRouter;
