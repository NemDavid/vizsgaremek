const express = require("express");
const router = express.Router();
const user_profileController = require("../controllers/user_profileController");
const paramHandler = require("../middlewares/paramHandler")
const authMiddleware = require("../middlewares/authMiddleware");

//---------------------------------------------------------
const { getStorage } = require("../utilities/cloudUtils");
const upload = getStorage()
const cloudMiddleware = require("../middlewares/uploadMiddleware");
//---------------------------------------------------------

router.param("paramPage", paramHandler.paramPage)
router.param("userId", paramHandler.paramUserId)

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------
router.get("/all",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_profileController.getUser_Profiles);
router.get("/pages/:paramPage",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_profileController.getUser_ProfilesByPage);
router.delete("/:userId",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_profileController.deleteUser_Profile);
router.post("/",[authMiddleware.userIsLoggedIn,authMiddleware.isAdmin],  user_profileController.createUser_Profile);

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------
//GET
router.get("/:userId",[authMiddleware.userIsLoggedIn], user_profileController.getUser_Profile);
//POST


//DELETE


//PATCH
router.patch("/:userId", [authMiddleware.userIsLoggedIn,upload.single("avatar"), cloudMiddleware.Req_HasFile], user_profileController.updateUser_Profile);





module.exports = router;
