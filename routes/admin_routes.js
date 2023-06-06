const express = require("express");
const router = express.Router();
const { getAllUser, getUserById, deleteUserById } = require("../controller/admin_controller");
const {verifyToken}  =require('../controller/auth_controller');

// console.log("inside user routes");

router.route("/").get(verifyToken,getAllUser);
router.route("/:id").get(verifyToken,getUserById);
router.route("/:id").delete(verifyToken,deleteUserById);

module.exports = router;
