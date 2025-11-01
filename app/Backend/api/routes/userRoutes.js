const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const paramHandler = require("../middlewares/paramHandler")


router.param("userId", paramHandler.paramUserId);
router.param("paramPage", paramHandler.paramPage);


router.get("/users", userController.getUsers);

router.get("/users/:paramPage", userController.getUsersByPage);


router.delete("/user/:userId", userController.deleteUser);

router.post("/user", userController.createUser);

router.patch("/user/:userId", userController.updateUser);

module.exports = router;
