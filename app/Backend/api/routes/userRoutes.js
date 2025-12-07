const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const paramHandler = require("../middlewares/paramHandler")


router.param("userId", paramHandler.paramUserId);
router.param("paramPage", paramHandler.paramPage);
router.param("uniqIdentifier", paramHandler.paramUniqIdentifier);


router.get("/users", userController.getUsers);

router.get("/user/:userId", userController.getUser);

router.get("/users/:paramPage", userController.getUsersByPage);

router.get("/users/:uniqIdentifier", userController.getUserByUsernameOrUserId);


router.delete("/user/:userId", userController.deleteUser);

router.post("/user", userController.createUser);

router.patch("/user/:userId", userController.updateUser);

router.get("/get_existing_user/:token", userController.getExistingUserByToken);

module.exports = router;
