const { Router } = require("express");

const prisma = require("../lib/prisma");

const loanRouter = Router();

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
    return res.status(500).json({ error: err });
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

module.exports = loanRouter;
