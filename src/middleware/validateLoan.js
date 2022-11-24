const { checkSchema } = require("express-validator");

module.exports.loanValidator = checkSchema({
  desc: {
    in: "body",
    notEmpty: true,
    trim: true,
    errorMessage: "Loan must have a description",
  },
  collateral: {
    in: "body",
    trim: true,
    notEmpty: true,
    errorMessage: "field can not be empty",
  },
  loanTypeId: {
    in: "body",
    isNumeric: true,
    errorMessage: "Enter a correct loan type id for this loan",
  },
  startDate: {
    in: "body",
    trim: true,
    isISO8601: true,
    toDate: true,
    errorMessage: "Please enter a properly formatted date",
  },
  dueDate: {
    in: "body",
    trim: true,
    isISO8601: true,
    toDate: true,
    errorMessage: "Please enter a properly formatted date",
  },
});

module.exports.loanTypeValidator = checkSchema({
  name: {
    in: "body",
    trim: true,
    notEmpty: true,
    errorMessage: "name field can not be empty",
  },
  desc: {
    in: "body",
    trim: true,
    notEmpty: true,
    errorMessage: "Please enter a valid description for the loan type",
  },
  amount: {
    in: "body",
    isNumeric: true,
    notEmpty: true,
    errorMessage: "Field can not be blank",
  },
  interest: {
    in: "body",
    isDecimal: true,
    notEmpty: true,
    errorMessage: "field cannot be empty",
  },
});
