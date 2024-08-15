const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User");

router.post("/signup", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/sendCode", UserController.sendCode);
router.post("/sendCodeWhenSignup", UserController.sendCodeWhenSignup);
router.post("/loanRequest", UserController.loanRequest);
router.post("/cancelLoanRequest", UserController.cancelLoanRequest);
router.post("/submitComplaint", UserController.submitComplaint);

router.get("/getcurentLoanDetails", UserController.currentLoanDetails);
router.get("/loanHistory", UserController.loanHistory);
router.get("/complaintsHistory", UserController.complaintsHistory);
router.get("/loanRequest", UserController.existingLoanRequest);
router.get("/loanRequestHistory", UserController.loanRequestHistory);

router.put("/changePhoneNumber", UserController.changePhoneNumber);

module.exports = router;