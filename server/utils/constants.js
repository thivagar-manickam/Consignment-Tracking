/**
 * This is the constants file
 * that will contain all the
 * const values to be used
 * through out the application
 *
 * @author M. Thivagar
 * Last Modified - 27/04/2020
 */

const LOGGER_LEVEL = {
  INFO: "info",
  ERROR: "error",
  WARNING: "warn",
};

const MONGO_URL = "mongodb://localhost:27017/consignment_management";

module.exports = { LOGGER_LEVEL, MONGO_URL };
