const express = require("express");
const router = express.Router();
const { getAllUser, getUserById } = require("../controller/user_controller");
console.log("inside user routes")
router.route("/").get(getAllUser);
router.route("/:id").get(getUserById);
module.exports = router;
