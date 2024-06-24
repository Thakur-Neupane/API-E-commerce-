import { verifyAccessJWT } from "../utils/jwt";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const decoded = verifyAccessJWT(authorization);

      if (decoded?.email) {
        throw new Error({ message: decoded, statuscode: 200 });
      }
    }
  } catch (error) {
    next(error);
  }
};
