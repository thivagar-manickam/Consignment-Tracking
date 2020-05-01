/**
 * This file contains the
 * Schema definition for the User collection
 *
 * @author M. Thivagar
 * Last Modified - 27/04/2020
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
  isUserAuthenticated: Boolean,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
