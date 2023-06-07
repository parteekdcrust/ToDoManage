const express = require("express");
const router = express.Router();
const { getAllUser, getUserById, deleteUserById } = require("../controller/admin_controller");
const {verifyToken, authorize}  =require('../controller/auth_controller');


router.route("/").get(verifyToken,authorize(["Admin"]),getAllUser);
router.route("/:id").get(verifyToken,authorize(["Admin"]),getUserById);
router.route("/:id").delete(verifyToken,authorize(["Admin"]),deleteUserById);

module.exports = router;
