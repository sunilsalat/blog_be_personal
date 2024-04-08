import express from "express";
import * as AuthController from "../../controllers/auth.controller";
import { commonVals } from "../commonVals";
import { AuthMiddleware, ThrowValidationErrors } from "../../middlewares";

const router = express.Router();

// vals

const registerVals = [commonVals.email("email", "Provide valid phone")];

const setProfilePinVals = [
  commonVals.string("password", "Password is required", 4, 4),
];

const verifyOtpVals = [
  commonVals.string("secret", "Provide valid data"),
  commonVals.number("otp", "Provide valid otp", 1111, 9999),
];

const loginVals = [
  commonVals.email("email", "Provide valid email"),
  commonVals.string("password", "Password is required"),
];

// routers

router.post(
  "/register",
  // [...registerVals, ThrowValidationErrors],
  AuthController.register
);

router.post(
  "/verify",
  // [...verifyOtpVals, ThrowValidationErrors],
  AuthController.verifyOtpAndGrantAccess
);

router.post(
  "/login",
  [...loginVals, ThrowValidationErrors],
  AuthController.login
);
router.post("/logout", [AuthMiddleware], AuthController.logout);

export default router;
