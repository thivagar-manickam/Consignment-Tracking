/**
 * This file will contain all the routes
 * related to user authentication and user
 * registration
 *
 * @author M. Thivagar
 * Last Modified - 27/04/2020
 *
 * ROUTES
 * -------
 * /login
 * /register
 * /logout
 */

const express = require("express");
const router = express.Router();
const utils = require("../utils/utility");
const logger = require("../logger");
const User = require("../models/userModel");
const { INFO, ERROR } = require("../utils/constants").LOGGER_LEVEL;
const middleware = require("../utils/middleware");

router.post("/login", (req, res) => {
  const username = req.body.username;
  logger.info({
    level: INFO,
    message: `Going to authenticate the user ${username}`,
  });
  try {
    User.find({ username }, (err, foundUser) => {
      if (err) {
        logger.log({
          level: ERROR,
          message: `Error while trying to authenticate the user with username: ${username} with error: ${err}`,
        });
        res.send({
          success: false,
          message: `Error while authenticating the user. Please try again later.`,
        });
      } else {
        if (foundUser.length != 0) {
          const decryptPassword = utils.decryptCipherText(
            foundUser[0].password
          );
          if (decryptPassword === req.body.password) {
            const userId = foundUser[0]._id;
            const token = utils.generateToken(username, req.body.password);
            utils.authenticateUser(userId, token, res);
          } else {
            logger.log({
              level: INFO,
              message: `Invalid password`,
            });
            res.send({
              success: false,
              message: `Invalid password. Plase check the password`,
            });
          }
        } else {
          logger.log({
            level: INFO,
            message: `Invalid username`,
          });
          res.send({
            success: false,
            message: `Invalid username. Plase check the username`,
          });
        }
      }
    });
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Error while authenticating user ${username} with error: ${exception}`,
    });
  }
});

router.post("/register", (req, res) => {
  logger.log({ level: INFO, message: "Going to create a new user" });
  try {
    let encryptedPassword = utils.encryptPlainText(req.body.password);
    console.log(req.body);
    console.log(req.body.password);
    const userObj = {
      username: req.body.username,
      password: encryptedPassword,
    };
    User.find({ username: req.body.username }, (err, foundUser) => {
      if (err) {
        logger.log({
          level: ERROR,
          message: `Error while trying to retrieve the user data for username: ${req.body.username} with error: ${err}`,
        });
      } else {
        if (foundUser.length == 0) {
          User.create(userObj, (err, _user) => {
            if (err) {
              logger.log({
                level: ERROR,
                message: `Error while creating a new user: ${err}`,
              });
              res.send({
                success: false,
                message: `Error while creating a new user.Please try again later.`,
              });
            } else {
              logger.log({
                level: INFO,
                message: `Successfully created the new user with username: ${req.body.username}`,
              });
              res.send({
                success: true,
                statusCode: 200,
                data: "User created successfully",
              });
            }
          });
        } else {
          logger.log({
            level: INFO,
            message: `Username ${req.body.username} already exist`,
          });
          res.send({
            success: false,
            message: "Username already exist. Choose a different username",
          });
        }
      }
    });
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Exception while trying to add a new user. Exception: ${exception}`,
    });
    res.send({
      success: false,
      message: `Error while creating a new user.Please try again later.`,
    });
  }
});

router.post("/logout", middleware.verifyToken, (req, res) => {
  logger.log({
    level: INFO,
    message: `Logging out the user with id: ${req.body.obj.userId}`,
  });
  try {
    User.findById(req.body.obj.userId, (err, foundUser) => {
      if (err) {
        logger.log({
          level: INFO,
          message: `Error when trying to find the user with id : ${req.body.obj.userId}; Error: ${err}`,
        });
        res.send({
          success: false,
          message: `Error when trying to logout the user.`,
        });
      } else {
        if (foundUser.length != 0) {
          logger.log({
            level: INFO,
            message: `Going to clear the token value for user with id: ${req.body.userId}`,
          });
          const userId = req.body.obj.userId;
          const token = "";
          const isUserAuthenticated = false;
          const finalJSON = {
            token,
            isUserAuthenticated,
          };
          User.findByIdAndUpdate(userId, finalJSON, (err, user) => {
            if (err) {
              logger.log({
                level: ERROR,
                message: `Error while clearing the token value for user with id: ${userId}; Error: ${err}`,
              });
              res.send({
                success: false,
                message: `Error when trying to logout the user.`,
              });
            } else {
              if (user.length != 0) {
                logger.log({
                  level: INFO,
                  message: `Successfully logged out the user with id: ${userId}`,
                });
                res.send({ success: true, statusCode: 200 });
              } else {
                logger.log({
                  level: ERROR,
                  message: `Error while clearing the token value for user with id: ${userId}`,
                });
                res.send({
                  success: false,
                  message: `Error when trying to logout the user.`,
                });
              }
            }
          });
        }
      }
    });
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Error while trying to logout the user with id: ${req.body.userId}; Error: ${exception}`,
    });
  }
});
module.exports = router;
