/**
 * This file will contain all the routes
 * related to consignment management
 *
 * @author M. Thivagar
 * Last Modified - 01/05/2020
 *
 * ROUTES
 * -------
 * /add
 * /edit/id
 * /get/id
 */

const express = require("express");
const router = express.Router();
const logger = require("../logger");
const { INFO, ERROR } = require("../utils/constants").LOGGER_LEVEL;
const dateFields = require("../utils/constants").DATE_FIELDS;

const Consignment = require("../models/consignmentModel");
const middleware = require("../utils/middleware");
const moment = require("moment");

router.get("/", middleware.verifyToken, (req, res) => {
  logger.log({
    level: INFO,
    message: `Going to fetch all the consignment details`,
  });
  try {
    Consignment.find({}, (err, foundConsignment) => {
      if (err) {
        logger.log({
          level: ERROR,
          message: `Error in retrieving the consignment details`,
        });
        res.send({
          success: false,
          statusCode: 500,
          message: `Error while retrieving the consignment details. Please try later`,
        });
      } else {
        logger.log({
          level: INFO,
          message: `Retrieved the consignment details successfully`,
        });
        res.send({
          success: true,
          statusCode: 200,
          data: foundConsignment,
        });
      }
    });
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Exception while trying to fetch all the consignment details`,
    });
    res.send({
      success: false,
      statusCode: 500,
      message: `Error in retrieving the consignment details. Please try again`,
    });
  }
});
router.post("/get", middleware.verifyToken, (req, res) => {
  logger.log({
    level: INFO,
    message: `Going to fetch the consignment details based on the Contract number`,
  });
  let contractNumber = req.body.obj.consignmentNumber;
  try {
    Consignment.find(
      { Contract_Number: contractNumber },
      (err, foundConsignment) => {
        if (err) {
          logger.log({
            level: ERROR,
            message: `Error while trying to retrieve the consignment details with contract number: ${req.params.id} with error: ${err}`,
          });
          res.send({
            success: false,
            statusCode: 500,
            message: `Error while retrieving the consignment details. Please try again later`,
          });
        } else {
          if (foundConsignment.length != 0) {
            logger.log({
              level: INFO,
              message: `Retrieved the consignment details successfully`,
            });
            res.send({
              success: true,
              statusCode: 200,
              data: foundConsignment[0],
            });
          } else {
            logger.log({
              level: INFO,
              message: `Retrieved the consignment details successfully. Consignment details not found`,
            });
            res.send({
              success: true,
              statusCode: 200,
              message: `Consignment details not found for given Contract Number`,
            });
          }
        }
      }
    );
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Exception while fetching the consignment details`,
    });
    res.send({
      success: false,
      statusCode: 500,
      message: `Error while retrieving the consignment details. Please try again later`,
    });
  }
});

router.put("/edit/:id", middleware.verifyToken, (req, res) => {
  logger.log({
    level: INFO,
    message: `Going to update the consignment details for the contract number: ${req.params.id}`,
  });

  try {
    const obj = req.body.obj;
    if (obj.On_Board_Date && obj.Discharge_Date) {
      const onBoardDate = moment(obj.On_Board_Date).format("MM/DD/YYYY");
      const dischargeDate = moment(obj.Discharge_Date).format("MM/DD/YYYY");
      const sailingTime = moment(dischargeDate).diff(onBoardDate, "days");
      obj.Sailing_Time = sailingTime;
    }
    if (obj.Invoice_Paid_Date && obj.Invoice_Date) {
      const invoiceDate = moment(obj.Invoice_Date).format("MM/DD/YYYY");
      const invoicePaidDate = moment(obj.Invoice_Paid_Date).format(
        "MM/DD/YYYY"
      );
      const paymentDuration = moment(invoicePaidDate).diff(invoiceDate, "days");
      obj.Payment_Duration = paymentDuration;
    }
    Object.keys(obj).forEach((value) => {
      if (dateFields.indexOf(value) > -1) {
        if (obj[value]) obj[value] = moment(obj[value]).format("MM/DD/YYYY");
      }
    });
    Consignment.findByIdAndUpdate(req.params.id, obj, (err) => {
      if (err) {
        logger.log({
          level: ERROR,
          message: `Error while updating the consignment detail for contract number: ${req.params.id}`,
        });
        res.send({
          success: false,
          statusCode: 500,
          message: `Erro while updating the consignment detail. Please try again later`,
        });
      } else {
        logger.log({
          level: INFO,
          message: `Updated the consignment details successfully`,
        });
        res.send({
          success: true,
          statusCode: 200,
          message: "Updated the consignment details successfully",
        });
      }
    });
  } catch (exception) {
    logger.log({
      level: ERROR,
      message: `Exception while trying to update the consignment details`,
    });
    res.send({
      success: false,
      statusCode: 500,
      message: `Unable to update the consigment detail. Please try again later`,
    });
  }
});

router.post("/add", middleware.verifyToken, (req, res) => {
  try {
    const obj = req.body.obj;
    logger.log({
      level: INFO,
      message: `Going to check if contract number already exist`,
    });
    const searchQuery = {
      Contract_Number: obj.Contract_Number,
    };
    Consignment.find(searchQuery, (err, foundConsignment) => {
      if (err) {
        logger.log({
          level: ERROR,
          message: `Error while checking if the contract number already exist`,
        });
        res.send({
          statusCode: 500,
          success: false,
          message: `Unable to create the consignment. Please try again`,
        });
      } else {
        if (foundConsignment.length == 0) {
          Object.keys(obj).forEach((value) => {
            if (dateFields.indexOf(value) > -1) {
              if (obj[value])
                obj[value] = moment(obj[value]).format("MM/DD/YYYY");
            }
          });
          Consignment.create(obj, (err) => {
            if (err) {
              logger.log({
                level: ERROR,
                message: `Error while creating the new consignment with error: ${err}`,
              });
              res.send({
                statusCode: 500,
                success: false,
                message: `Unable to create the consignment. Please try again`,
              });
            } else {
              logger.log({
                level: INFO,
                message: `Created the new consignment successfully`,
              });
              res.send({
                success: true,
                statusCode: 200,
                message: `Consignment created successfully`,
              });
            }
          });
        } else {
          logger.log({
            level: INFO,
            message: `The given contract number already exist`,
          });
          res.send({
            success: false,
            statusCode: 200,
            message: `Contract number already exist`,
          });
        }
      }
    });
  } catch (exception) {
    logger.log({
      INFO: ERROR,
      message: `Exception while trying to add the consignment details`,
    });
    res.send({
      success: false,
      statusCode: 500,
      message: `Error while creating new consignment`,
    });
  }
});

module.exports = router;
