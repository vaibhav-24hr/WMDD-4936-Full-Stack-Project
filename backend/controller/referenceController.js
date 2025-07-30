const path = require("path");
const { readJSON, writeJson } = require("../utilities/fileutils");
const uuid = require("uuid");

const REFRENCE_FILE = "references.json";

const getUserRefrence = (req, res) => {
  const userId = req.params.id;

  const refrences = readJSON(REFRENCE_FILE)[userId] || [];

  if (refrences.length == 0) {
    return res.status(204).json([]);
  }

  res.status(200).json(refrences);
};

const createUserRefrence = (req, res) => {
  const userId = req.params.id;
  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }
  const {
    firstName,
    lastName,
    jobTitle,
    company,
    email,
    phone,
    referenceType,
    linkedIn,
    relationship,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !jobTitle ||
    !company ||
    !email ||
    !referenceType
  ) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  const data = readJSON(REFRENCE_FILE);

  const newRefrence = {
    id: uuid.v4(),
    firstName,
    lastName,
    jobTitle,
    company,
    email,
    phone,
    referenceType,
    linkedIn,
    relationship,
  };

  if (!data[userId]) {
    data[userId] = [];
  }

  data[userId].push(newRefrence);
  writeJson(REFRENCE_FILE, data);

  res
    .status(201)
    .json({ message: "Reference added successfully.", refrences: newRefrence });
};

const updateUserRefrence = (req, res) => {
  const userId = req.params.id;
  const refrenceId = req.params.refrenceId;

  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }

  const {
    firstName,
    lastName,
    jobTitle,
    company,
    email,
    phone,
    referenceType,
    linkedIn,
    relationship,
  } = req.body;

  const allData = readJSON(REFRENCE_FILE);

  const refrences = allData[userId] || [];
  const index = refrences.findIndex((r) => r.id == refrenceId);

  if (index === -1) {
    return res.status(404).json({ message: "Reference not found" });
  }

  refrences[index] = {
    id: refrenceId,
    firstName,
    lastName,
    jobTitle,
    company,
    email,
    phone,
    referenceType,
    linkedIn,
    relationship,
  };

  allData[userId] = refrences;
  writeJson(REFRENCE_FILE, allData);

  res.status(200).json(refrences[index]);
};

const deleteUserRefrence = (req, res) => {
  const userId = req.params.id;
  const refrenceId = req.params.refrenceId;

  const allData = readJSON(REFRENCE_FILE);
  const refrences = allData[userId] || [];
  const index = refrences.findIndex((r) => r.id == refrenceId);

  if (!refrences) {
    return res
      .status(404)
      .json({ message: "User not found or no references." });
  }

  if (index === -1)
    return res.status(404).json({ message: "Reference not found" });

  refrences.splice(index, 1);
  allData[userId] = refrences;
  writeJson(REFRENCE_FILE, allData);
  res.status(204).send();
};

const patchUpdateUserRefrence = (req, res) => {
  const userId = req.params.id;
  const refrenceId = req.params.refrenceId;

  if (!req.body) {
    return res.status(400).json({ message: "Updates missing in request" });
  }

  const updates = req.body;
  const allData = readJSON(REFRENCE_FILE);
  const refrences = allData[userId];

  if (!refrences) {
    return res
      .status(404)
      .json({ message: "User not found or has no references" });
  }

  const refrenceIndex = refrences.findIndex((r) => r.id == refrenceId);

  if (refrenceIndex === -1) {
    return res.status(404).json({ message: "Reference not found" });
  }

  Object.assign(refrences[refrenceIndex], updates);
  allData[userId] = refrences;

  writeJson(REFRENCE_FILE, allData);
  res.status(200).json(refrences[refrenceIndex]);
};

module.exports = {
  getUserRefrence,
  createUserRefrence,
  updateUserRefrence,
  deleteUserRefrence,
  patchUpdateUserRefrence,
};
