"use strict";
const { Router } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { generateAccountNumber } = require("../helpers");
const authMiddleware = require("../middleware/authMiddleWare");
const {
  signupValidator,
  loginValidator,
} = require("../middleware/validateUser");
const prisma = require("../lib/prisma");

require("dotenv").config();

let userRouter = Router();

userRouter.get("", async (_, res) => {
  try {
    const users = await prisma.customer.findMany();
    return res.status(200).json({ success: false, data: { users } });
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

    return res.cookie({ token: token }).json({
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
    console.log(error);
    return res.status(500).json({ error });
  }
});

userRouter.post("login", loginValidator, async (req, res) => {
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
        acc_num: acc_num,
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        acc_num: true,
        email: true,
        phone_num: true,
        address: true,
        gender: true,
        dob: true,
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

    return res.cookie({ token: token }).json({
      success: true,
      message: "Login successful",
      data: { customer: customer },
    });

    //return user
  } catch (error) {
    return res.status(500).json({ error });
  }
});

userRouter.delete(":id", authMiddleware, async (req, res) => {});

module.exports = userRouter;
