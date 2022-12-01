const { Router } = require("express");
const rateLimiter = require("express-rate-limit");
const { validationResult, matchedData } = require("express-validator");

const prisma = require("../lib/prisma");
const { adminAuth, userAuth } = require("../middleware/authMiddleWare");
const {
  loanValidator,
  loanTypeValidator,
} = require("../middleware/validateLoan");

const loanRouter = Router();
const limiter = rateLimiter({
  windowMs: 45 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
});

const customerGreenData = {
  id: true,
  fname: true,
  lname: true,
  acc_num: true,
  email: true,
  phone_num: true,
  address: true,
  gender: true,
  dob: true,
};
const greenData = {
  id: true,
  desc: true,
  collateral: true,
  startDate: true,
  dueDate: true,
  isSettled: true,
  type: true,
  customer: {
    select: customerGreenData,
  },
};

loanRouter.get("", async (_, res) => {
  try {
    const loans = await prisma.loan.findMany({
      select: greenData,
    });

    return res.status(200).json({ success: true, data: { loans } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

loanRouter.post("", limiter, userAuth, loanValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.user)
    return res.status(403).json({ success: false, error: "Access Denied" });

  try {
    const { desc, collateral, loanTypeId, startDate, dueDate } = req.body;

    const existingLoan = await prisma.loan.findMany({
      where: {
        customerId: parseInt(req.user.id, 10),
        isSettled: false,
      },
    });

    if (existingLoan.length > 0)
      return res
        .status(409)
        .json({ success: false, error: "User already owes a loan" });

    const loan = await prisma.loan.create({
      data: {
        desc,
        collateral,
        customerId: parseInt(req.user.id, 10),
        loanTypeId,
        startDate,
        dueDate,
      },
    });

    return res.status(201).json({ success: true, data: { loan } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

loanRouter.get("/types", async (_, res) => {
  try {
    const loanTypes = await prisma.loanType.findMany();

    return res.status(200).json({ success: true, data: { loanTypes } });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

loanRouter.post("/type", adminAuth, loanTypeValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.admin)
    return res.status(403).json({ success: false, error: "Access Denied" });

  try {
    const { name, desc, amount, interest } = req.body;

    const existingType = await prisma.loanType.findUnique({
      where: {
        name: name,
      },
    });

    if (existingType)
      return res.status(400).json({
        success: false,
        error: "This loan type already exists",
      });

    const type = await prisma.loanType.create({
      data: {
        name,
        desc,
        amount,
        interest,
      },
    });

    return res.status(201).json({ success: true, data: { loanType: type } });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

module.exports = loanRouter;
