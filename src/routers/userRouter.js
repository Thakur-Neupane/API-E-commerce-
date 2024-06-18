import express from "express";
const router = express.Router();
import { hashPassword } from "../utils/bcrypt.js";
import { insertUser } from "../models/user/UserModel.js";
import newUserValidation from "../middlewares/validation.js";
import { deleteSession, insertSession } from "../models/session/sessionModel.js";
import { v4 as uuid } from "uuid";

router.get("/", (req, res, next) => {
  try {
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
    console.log(req.body);

    req.body.password = hashPassword(req.body.password);

    const user = await insertUser(req.body);
    if (user?._id) {
      // create unique url and add in the database
      const obj = {
        token: "",
        associate: user.email,
      };

      const result = await insertSession(obj);
      if (result?._id)
        // process for sending email
        return res.json({
          status: "success",
          message:
            "Account has been created. Please check the email to validate ",
        });
    }

    res.json({
      status: "error",
      message: "Can't create account, please try again later.",
    });
  } catch (error) {
    next(error);
  }
});

// user verification 
router.post("/user-verification",  async (req, res, next) => {
  try {
const {c, e}= req.body

// delete session data 
const session = await deleteSession({
  token: c,
  associate:e
})

if (session?._id){
res.json({
  status: "success",
  message : "Your account has been verified."
})


// update user table
const result = await updateUserById(
  {email, e  },
  {
    status:"active",
    isEmailVerified : true,

  }


})

: res.json({
  status:"error",
  message: "Invalid link please contact admin"
})

    console.log(req.body);

    req.body.password = hashPassword(req.body.password);

    const user = await insertUser(req.body);
    if (user?._id) {
      // create unique url and add in the database
      const obj = {
        token: "",
        associate: user.email,
      };

      const result = await insertSession(obj);
      if (result?._id)
        // process for sending email
        return res.json({
          status: "success",
          message:
            "Account has been created. Please check the email to validate ",
        });
    }

    res.json({
      status: "error",
      message: "Can't create account, please try again later.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
