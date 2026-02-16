const express = require("express");
const router = express.Router();
const authMiddleware =  require("../middlewares/authMiddleware");
const advertisementController = require("../controllers/advertisementController");
const { getStorage } = require("../utilities/cloudUtils");
const paramHandler = require("../middlewares/paramHandler")


const upload = getStorage();

router.param("itemId", paramHandler.paramItemId);


router.get("/all", advertisementController.getAdvertisements);

router.get("/random", advertisementController.getRandomAdvertisement);

router.get("/:itemId", advertisementController.getAdvertisement);



router.delete("/:itemId", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin], advertisementController.deleteAdvertisement);

router.post("/", [authMiddleware.userIsLoggedIn, authMiddleware.isAdmin, upload.single("image")], advertisementController.createAdvertisement);



module.exports = router;
