/**
 * This javascript file will contain
 * all the middlewares required to be
 * run before any server code is executed
 * @author Thivagar
 * Last Modified - 01/05/20
 METHODS
 --------
 verifyToken() 
 */
const User = require("../models/userModel");
const { INFO, ERROR } = require("../utils/constants").LOGGER_LEVEL;
const logger = require("../logger");
var middlewareObject = {};

middlewareObject.verifyToken = (req, res, next) => {
  let userId, token;
  try {
    userId = req.body.obj != undefined ? req.body.obj.userId : req.query.obj;
    let usertoken = req.body.obj != undefined ? req.body.obj.token : "";
    token = req.headers["authorization"]
      ? req.headers["authorization"]
      : usertoken;
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    if (token) {
      User.findById(userId, (err, user) => {
        if (err) {
          logger.log({
            level: ERROR,
            message: `Error while fetching user data with id: ${userId} for token verification`,
          });
        } else {
          if (user.length != 0) {
            if (user.isUserAuthenticated) {
              const userToken = user.token;
              if (token === userToken) {
                next();
              } else {
                logger.log({
                  level: INFO,
                  message: `Invalid authorization token for userId: ${user.id}`,
                });
                res.send({
                  statusCode: 401,
                  success: false,
                  message: "Invalid authorization token.Please login again",
                });
              }
            } else {
              res.send({
                statusCode: 401,
                success: false,
                message: "User not logged in. Please login",
              });
            }
          }
        }
      });
    } else {
      logger.log({
        level: INFO,
        message: `Invalid authorization token for userId: ${user.id}`,
      });
      res.send({
        success: false,
        statusCode: 401,
        message: "Invalid authorization token",
      });
    }
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Exception while token verification for userId: ${userId} with error: ${exception}`,
    });
    res.send({
      statusCode: 500,
      success: false,
      message: "Internal Server error. Please try again",
    });
  }
};

module.exports = middlewareObject;
