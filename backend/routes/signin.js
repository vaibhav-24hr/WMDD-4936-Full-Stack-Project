const express = require("express");
const { getUsers } = require("../utilities/userStorage");
const router = express.Router();
const bcrypt = require("bcrypt");

// Import new middleware
// const { loginLimiter } = require("../middleware/rateLimiter");
// const { sanitizeInput } = require("../middleware/sanitizer");
// const { requestSizeLimiter } = require("../middleware/requestLimiter");
// const { sessionManager } = require("../middleware/sessionManager");

let userExistMail;

const userExist = (req, res, next) => {
  const userSubmittedEmail = req.body.email;

  const existingUser = getUsers();

  console.log("Submitted Email:", userSubmittedEmail);
  console.log(
    "All Users:",
    existingUser.map((u) => u.email)
  ); // just show emails

  userExistMail = existingUser.find((user) => {
    return user.email === userSubmittedEmail;
  });

  if (!userExistMail) {
    const error = new Error(
      "User with mail is not exist either signup or use another mail id."
    );
    error.status = 400;
    next(error);
  } else next();
};

const passwordCheck = async (req, res, next) => {
  const userSubmittedPassword = req.body.password;
  try {
    const passwordMatch = await bcrypt.compare(
      userSubmittedPassword,
      userExistMail.password
    );

    if (!passwordMatch) {
      const error = new Error("Invalid Username or Password");
      error.status = 401;
      return next(error);
    }
    next();
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

router.post(
  "/signin",
  // loginLimiter,
  // requestSizeLimiter,
  // sanitizeInput,
  userExist,
  passwordCheck,
  // sessionManager,
  (req, res, next) => {
    const { email } = req.body;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        email,
        firstName: userExistMail.firstName,
        lastName: userExistMail.lastName,
      },
    });
  }
);

// router.post("/signin", userExist, passwordCheck, (req, res, next) => {
//   const { email } = req.body;

//   res.status(200).json({
//     success: true,
//     message: "Login successful",
//     user: { email },
//   });
// });

module.exports = router;
