import express from "express";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { getAUser, insertUser, updateUser } from "../models/user/UserModel.js";
import { newUserValidation } from "../middlewares/validation.js";
import {
  deleteSession,
  insertSession,
} from "../models/session/SessionModel.js";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { emailVerificationMail } from "../services/email/nodemailer.js";
import { getTokens, signAccessJWT, signRefreshJWT } from "../utils/jwt.js";
import { auth } from "../middlewares/auth.js";

router.get("/", auth, (req, res, next) => {
  try {
    const { userInfo } = req;
    userInfo?._id;
    res.json({
      status: "success",
      message: "TODO",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", newUserValidation, async (req, res, next) => {
  try {
    // encrypt password
    req.body.password = hashPassword(req.body.password);

    const user = await insertUser(req.body);

    if (user?._id) {
      // create unique url and add in the database
      const token = uuidv4();
      const obj = {
        token,
        associate: user.email,
      };

      const result = await insertSession(obj);
      if (result?._id) {
        //process for sending email

        emailVerificationMail({
          email: user.email,
          fName: user.fName,
          url:
            process.env.FE_ROOT_URL + `/verify-user?c=${token}&e=${user.email}`,
        });
        return res.json({
          status: "success",
          message:
            "We have send you an email with insturction to verify your  account. Pelase chekc email/junk to verify your account",
        });
      }
    }

    res.json({
      status: "error",
      message: "Error Unable to create an account, Contact administration",
    });
  } catch (error) {
    next(error);
  }
});

//user verification
router.post("/user-verification", async (req, res, next) => {
  try {
    const { c, e } = req.body;
    //delete session data

    const session = await deleteSession({
      token: c,
      associate: e,
    });
    if (session?._id) {
      //update user table
      const result = await updateUser(
        { email: e },
        {
          staus: "active",
          isEmailVerified: true,
        }
      );
      if (result?._id) {
        // send user an email
        return res.json({
          status: "success",
          message: "Your account has been verified. You may sign in now",
        });
      }
    }

    res.json({
      status: "error",
      message: "Invalid link, contact admin",
    });
  } catch (error) {
    next(error);
  }
});

// admin authentication
router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;
    const user = await getAUser({ email });

    // check if user exist with email

    if (user?._id) {
      // verify password
      const confirmPass = comparePassword(password, user.password);

      if (confirmPass) {
        // user is now authenticated

        res.json({
          status: "success",
          message: "Login Successful!",
          jwts: await getTokens(email),
        });
      }
    }

    // create jwt and return

    res.json({
      status: "error",
      message: "Unable to login, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
