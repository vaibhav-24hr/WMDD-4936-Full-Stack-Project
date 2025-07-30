const fs = require("fs");
const path = require("path");

const userFilePath = path.join(__dirname, "../data/users.json");

function getUsers() {
  try {
    if (!fs.existsSync(userFilePath)) return [];
    const data = fs.readFileSync(userFilePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.log("Error reading users file:", error);
    return [];
  }
}

function saveUser(user) {
  const allUsers = getUsers();
  allUsers.push(user);

  try {
    fs.writeFileSync(userFilePath, JSON.stringify(allUsers, null, 2));
  } catch (error) {
    console.log("Error writing user file:", error);
  }
}

module.exports = { saveUser, getUsers };
