const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

router.route("/").get(getAllUsers).post(createNewUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
