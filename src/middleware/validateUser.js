const { checkSchema } = require("express-validator");

// validation middleware are exported here

module.exports.signupValidator = checkSchema({
  fname: {
    in: "body",
    notEmpty: true,
    errorMessage: "First Name can not be empty",
    trim: true,
  },
  lname: {
    in: "body",
    notEmpty: true,
    errorMessage: "First Name can not be empty",
    trim: true,
  },
  email: {
    in: "body",
    isEmail: true,
    trim: true,
  },
  password: {
    isLength: {
      errorMessage: "Password should be at least 6 characters long",
      options: { min: 6 },
    },
  },
  phone_num: {
    trim: true,
    isLength: {
      errorMessage: "Phone number must be above 5 characters long",
      options: { min: 6 },
    },
  },
  address: {
    trim: true,
  },
  gender: {
    trim: true,
    isLength: {
      errorMessage: "Gender must be a single character(M or F)",
      options: { max: 1, min: 1 },
    },
  },
  dob: {
    trim: true,
    isISO8601: true,
    toDate: true,
    errorMessage: "Please enter a correctly formatted date",
  },
});

module.exports.loginValidator = checkSchema({
  acc_num: {
    notEmpty: {
      errorMessage: "Account number must be specified",
    },
    isLength: {
      errorMessage: "Account Number must be 6 digits long",
      options: { min: 6, max: 6 },
    },
  },
  password: {
    isLength: {
      errorMessage: "Password is not long enough",
      options: { min: 6 },
    },
  },
});

module.exports.updateValidator = checkSchema({
  fname: {
    in: "body",
    notEmpty: true,
    errorMessage: "First Name can not be empty",
    trim: true,
    optional: true,
  },
  lname: {
    in: "body",
    notEmpty: true,
    errorMessage: "First Name can not be empty",
    trim: true,
    optional: true,
  },
  email: {
    in: "body",
    isEmail: true,
    trim: true,
    optional: true,
  },
  phone_num: {
    trim: true,
    isLength: {
      errorMessage: "Phone number must be above 5 characters long",
      options: { min: 6 },
    },
    optional: true,
  },
  address: { trim: true },
  gender: {
    trim: true,
    isLength: {
      errorMessage: "Gender must be a single character(M or F)",
      options: { max: 1, min: 1 },
    },
    optional: true,
  },
  dob: {
    trim: true,
    isISO8601: true,
    toDate: true,
    errorMessage: "Please enter a correctly formatted date",
    optional: true,
  },
});

module.exports.updatePasswordValidator = checkSchema({
  newPassword: {
    notEmpty: {
      errorMessage: "Password can not be empty",
    },
    isLength: {
      errorMessage: "Password is not long enough",
      options: { min: 6 },
    },
  },
});
