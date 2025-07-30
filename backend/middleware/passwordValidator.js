const { body } = require("express-validator");

const passwordStrengthValidator = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .custom((value) => {
      // Check for common weak passwords
      const weakPasswords = ["password", "12345678", "qwerty", "admin", "user"];
      if (weakPasswords.includes(value.toLowerCase())) {
        throw new Error(
          "Password is too common. Please choose a stronger password."
        );
      }
      return true;
    }),
];

module.exports = { passwordStrengthValidator };
