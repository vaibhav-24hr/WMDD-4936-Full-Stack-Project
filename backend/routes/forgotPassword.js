const express = require("express");
// const router = express.Router();
// const nodemailer = require("nodemailer");
// const { getUsers } = require("../utilities/userStorage");

// // Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "vaibhavsocial1111@gmail.com",
//     pass: "YOUR_APP_PASSWORD", // Replace with your Gmail app password
//   },
// });

// router.post("/forgot-password", (req, res) => {
//   const { email } = req.body;
//   const users = getUsers();
//   const user = users.find((u) => u.email === email);

//   // For demo: if not found, just say "sent" (no info leak)
//   if (!user) {
//     return res
//       .status(200)
//       .json({ message: "If this email exists, the password has been sent." });
//   }

//   // Send the password in email (for demo only)
//   const mailOptions = {
//     from: "vaibhavsocial1111@gmail.com",
//     to: email,
//     subject: "Your JobTracker Password",
//     text: `Hi, your password is: ${user.password}\nYou can use it to login to JobTracker.`,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       return res.status(500).json({ message: "Failed to send email." });
//     } else {
//       return res
//         .status(200)
//         .json({ message: "If this email exists, the password has been sent." });
//     }
//   });
// });

// module.exports = router;

// TEMPORARILY DISABLED FOR DEPLOYMENT
// To re-enable: uncomment all lines above
module.exports = express.Router(); // Empty router for now
