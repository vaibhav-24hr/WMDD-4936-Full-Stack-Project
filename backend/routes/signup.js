const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
// IMPORT OUR UTILITIES FUNCTION
const { saveUser, getUsers } = require("../utilities/userStorage");

// Import new middleware
// const { signupLimiter } = require("../middleware/rateLimiter");
// const { sanitizeInput } = require("../middleware/sanitizer");
// const { requestSizeLimiter } = require("../middleware/requestLimiter");
const {
  passwordStrengthValidator,
} = require("../middleware/passwordValidator");
// const { sessionManager } = require("../middleware/sessionManager");

// ENCRYPT HAS password
const hashPassword = async (req, res, next) => {
  let currentPassword = req.body.password;
  try {
    const hashPassword = await bcrypt.hash(currentPassword, 10);
    req.body.password = hashPassword;
    next();
  } catch (error) {
    console.log(error.message);
    error.status = 400;
    next(error);
  }
};

// EXPRESS VALIDATOR VALIDATIONS

const signUpValidations = [
  body("firstName").notEmpty().withMessage("First name is Required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters"),
];

// Handle Express Validator

const validationResponder = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.status = 400;
    error.details = errors.array();
    next(error);
  }
  next();
};

// Middleware to checj if email exist or not.

const checkEmailExistence = (req, res, next) => {
  const userSubmittedEmail = req.body.email;

  const existingUsers = getUsers();
  const userExist = existingUsers.find(
    (user) => user.email === userSubmittedEmail
  );

  if (userExist) {
    const error = new Error("User aleready Exists");
    error.status = 400;
    // error.details = error.array();
    next(error);
    // return res.json({
    //   success: false,
    // message:""
    // });
  } else next();
};

router.post(
  "/signup",
  // signupLimiter, // Rate limiting
  // requestSizeLimiter, // Request size limit
  // sanitizeInput, // Input sanitization
  passwordStrengthValidator, // Strong password validation
  validationResponder,
  checkEmailExistence,
  hashPassword,
  // sessionManager, // Session management
  (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    let user = { firstName, lastName, email, password };
    console.log(user);

    // Add user to DB
    saveUser(user);

    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  }
);

module.exports = router;
