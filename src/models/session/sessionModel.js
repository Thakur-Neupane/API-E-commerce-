import SessionSchema from "./SessionSchema.js";

export const insertSession = (sessionObj) => {
  return SessionSchema(sessionObj).save();
};

export const deleteSession = (filter) => {
  return SessionSchema.findOneAndDelete(filter);
};
