const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const paramHandler = require("../middlewares/paramHandler")


router.param("userId", paramHandler.paramUserId);
router.param("paramPage", paramHandler.paramPage);
router.param("uniqIdentifier", paramHandler.paramUniqIdentifier);


router.get("/all", userController.getUsers);

router.get("/id/:userId", userController.getUser);

router.get("/page/:paramPage", userController.getUsersByPage); 

router.get("/see/:uniqIdentifier", userController.getUserByUsernameOrUserId);

router.get("/search/:uniqIdentifier", userController.searchUserByUsernameOrUserId);


router.delete("/:userId", userController.deleteUser);

router.post("/", userController.createUser);

router.patch("/:userId", userController.updateUser);

// router.get("/get_existing_user/:token", userController.getExistingUserByToken);
router.patch("/password/change",userController.updatePassword)

module.exports = router;
