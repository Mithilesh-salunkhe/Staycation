const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");



router.route("/signup")
    .get(userController.renderSignupForm)
    .post(WrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true }), userController.login);

//LOGOUT
router.get("/logout" , userController.logout);




module.exports = router;
