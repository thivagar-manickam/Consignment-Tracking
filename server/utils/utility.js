/**
 * This file will contain the common methods
 * required for various server files
 *
 * @author M. Thivagar
 * Last Modified - 27/04/2020
 *
 * METHODS
 * --------
 * generateToken()
 * decryptCipherText()
 * encrypPlainText()
 */

const jwt = require("jsonwebtoken");
const config = require("./config");
const expiresIn = "180m";
const cryptoJS = require("crypto-js");
const CIPHER_KEY = config.CIPHER_KEY;
const User = require("../models/userModel");
const logger = require("../logger");
const { INFO, ERROR } = require("./constants").LOGGER_LEVEL;
/**
 * This method is used to
 * generate the token for the given username
 * and password
 * @param {*} username
 * @param {*} password
 */
const generateToken = (username, password) => {
  let token = jwt.sign({ username, password }, config.secret, {
    expiresIn: expiresIn,
  });
  return token;
};

/**
 * This method is to decrypt the
 * cipher text
 * @param {*} cipherText
 * @returns string
 */
const decryptCipherText = (cipherText) => {
  let decipher = cryptoJS.AES.decrypt(cipherText, CIPHER_KEY);
  decipher = decipher.toString(cryptoJS.enc.Utf8);
  return decipher;
};

/**
 * This method is used to encrypt the
 * given plaintext
 * @param {*} plainText
 * @returns String
 */
const encryptPlainText = (plainText) => {
  let cipher = cryptoJS.AES.encrypt(plainText, CIPHER_KEY);
  cipher = cipher.toString();
  return cipher;
};

/**
 * This method will authenticate the
 * user on each REST call being made
 * @param {*} userId
 * @param {*} token
 * @param {*} res
 */
const authenticateUser = (userId, token, res) => {
  const isUserAuthenticated = true;
  User.findByIdAndUpdate(
    userId,
    { token, isUserAuthenticated },
    (err, user) => {
      if (err) {
        logger.log({
          level: ERROR,
          message: `Error while trying to update the user with userId: ${userId} with error: ${err}`,
        });
        res.send({
          success: false,
          message: `Error while authenticated the user. Please try again later`,
        });
      } else {
        if (user.length != 0) {
          logger.log({
            level: INFO,
            message: `Successfully authenticated the user`,
          });
          const data = {
            token,
            userId: user._id,
            isUserAuthenticated,
          };
          res.send({ success: true, statusCode: 200, data });
        } else {
          logger.log({
            level: ERROR,
            message: `Error while trying to update the user with userId: ${userId} with error: ${err}`,
          });
          res.send({
            success: false,
            message: `Error while authenticating the user. Please try again later`,
          });
        }
      }
    }
  );
};
module.exports = {
  generateToken: generateToken,
  encryptPlainText: encryptPlainText,
  decryptCipherText: decryptCipherText,
  authenticateUser: authenticateUser,
};
