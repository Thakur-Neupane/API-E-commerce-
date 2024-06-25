import express from "express";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { getAUser, insertUser, updateUser } from "../models/user/UserModel.js";
import { newUserValidation } from "../middlewares/validation.js";
import {
  deleteManySession,
  deleteSession,
  insertSession,
} from "../models/session/SessionModel.js";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { emailVerificationMail } from "../services/email/nodemailer.js";
import {
  getTokens,
  signAccessJWT,
  signRefreshJWT,
  verifyRefreshJWT,
} from "../utils/jwt.js";
import { auth } from "../middlewares/auth.js";

router.get("/", auth, (req, res, next) => {
  try {
    const { userInfo } = req;

    userInfo.refreshJWT = undefined;
    a;
    userInfo?.status === "active"
      ? res.json({
          status: "success",
          message: "",
          userInfo,
        })
      : res.json({
          status: "error",
          message:
            "your account has not been activated. Check your email to verify your account",
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

// Admin authentication

router.post("/login", async (req, res, next) => {
  try {
    let message = "";
    const { email, password } = req.body;
    // 1. cheich if user exist with email
    const user = await getAUser({ email });

    if (user?._id && user?.status === "active" && user?.isEmailVerified) {
      //verify passwords

      const confirmPass = comparePassword(password, user.password);

      if (confirmPass) {
        //useris now authenticated

        // create jwts then return

        return res.json({
          status: "success",
          message: "Login Successfull",
          jwts: await getTokens(email),
        });
      }
    }

    if (user?.status === "inactive") {
      message = "Your account is not active, contact admin";
    }

    if (!user?.isEmailVerified) {
      message = "User not verified, please check your email and verify";
    }

    res.json({
      status: "error",
      message: message || "Invalid login details",
    });
  } catch (error) {
    next(error);
  }
});

// return new jwt access

router.get("/new-accessjwt", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization);

    // verify jwt
    const decode = await verifyRefreshJWT(authorization);

    if (decode?.email) {
      // check if it exist in user table
      const user = await getAUser({
        email: decode.email,
        refreshJWT: authorization,
      });

      if (user?._id) {
        // create new access jwt and return

        const accessJWT = await signAccessJWT(decode.email);

        if (token) {
          return res.json({
            status: "success",
            message: "",
            accessJWT,
          });
        }
      }
    }

    // ELSE // return 401
    return res.json({
      status: "error",
      message: "Unauthorized",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", auth, async (req, res, next) => {
  try {
    const { email } = req.userInfo;

    await updateUser({ email }, { refreshJWT: "" });

    // verify jwt
    await deleteManySession({ associate: email });

    res.json({
      status: "success",
      message: "You are logged out ",
    });
  } catch (error) {
    next(error);
  }
});

// ELSE // return 401

export default router;
