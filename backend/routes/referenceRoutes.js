const express = require("express");
const router = express.Router();

const {
  getUserRefrence,
  createUserRefrence,
  updateUserRefrence,
  deleteUserRefrence,
  patchUpdateUserRefrence,
} = require("../controller/referenceController");

// Authentication middleware to protect references routes
const authenticateUser = (req, res, next) => {
  // For now, we'll use the user ID from params
  // In a real app, you'd get this from JWT token
  const userId = req.params.id;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Get All References from Specific User Id
router.get("/v1/users/:id/references", authenticateUser, getUserRefrence);

// Add Reference for User ID
router.post("/v1/users/:id/references", authenticateUser, createUserRefrence);

// Edit reference Data
router.put(
  "/v1/users/:id/references/:refrenceId",
  authenticateUser,
  updateUserRefrence
);

// Delete reference Data
router.delete(
  "/v1/users/:id/references/:refrenceId",
  authenticateUser,
  deleteUserRefrence
);

// Patch reference Data
router.patch(
  "/v1/users/:id/references/:refrenceId",
  authenticateUser,
  patchUpdateUserRefrence
);

module.exports = router;
