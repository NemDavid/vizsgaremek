const express = require("express");
const router = express.Router();
const authMiddleware =  require("../middlewares/authMiddleware");
const advertisementController = require("../controllers/advertisementController");
const { getStorage } = require("../utilities/cloudUtils");
const paramHandler = require("../middlewares/paramHandler")

const upload = getStorage();

router.param("itemId", paramHandler.paramItemId);

//--------------------------------------------------
//              NEM ADMIN
//--------------------------------------------------
//GET
router.get("/random",[authMiddleware.userIsLoggedIn], advertisementController.getRandomAdvertisement);

//--------------------------------------------------
//                   ADMIN
//--------------------------------------------------
//GET
router.get("/all", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin],advertisementController.getAdvertisements);
router.get("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin],advertisementController.getAdvertisement);

//POST
router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin, upload.single("image")], advertisementController.createAdvertisement);


//DELETE
router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.deleteAdvertisement);

//PATCH







module.exports = router;
