const express = require("express");
const router = express.Router();
const verify_codeController = require("../controllers/verify_codeController");
const paramHandler = require("../middlewares/paramHandler")


router.param("itemId", paramHandler.paramItemId);



router.get("/verify_codes", verify_codeController.getVerify_codes);

router.get("/verify_code/:itemId", verify_codeController.getVerify_code);

router.get("/verify_codesByEmail", verify_codeController.getVerify_codeByEmail);


router.delete("/verify_code/:itemId", verify_codeController.deleteVerify_code);

router.delete("/verify_codes", verify_codeController.deleteVerify_codesByEmail);

router.post("/verify_code", verify_codeController.createVerify_code);

router.patch("/verify_code/:itemId", verify_codeController.updateVerify_code);


module.exports = router;
