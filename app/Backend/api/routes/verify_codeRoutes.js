const express = require("express");
const router = express.Router();
const verify_codeController = require("../controllers/verify_codeController");
const paramHandler = require("../middlewares/paramHandler")


router.param("itemId", paramHandler.paramItemId);
router.param("email", paramHandler.paramEmail);



router.get("/", verify_codeController.getVerify_codes);

router.get("/:itemId", verify_codeController.getVerify_code);

router.get("/Email", verify_codeController.getVerify_codeByEmail);


router.delete("/:itemId", verify_codeController.deleteVerify_code);

router.delete("/", verify_codeController.deleteVerify_codesByEmail);

router.post("/", verify_codeController.createVerify_code);

router.patch("/:itemId", verify_codeController.updateVerify_code);

router.patch("/email/:email", verify_codeController.updateVerify_codeByEmail);


module.exports = router;
