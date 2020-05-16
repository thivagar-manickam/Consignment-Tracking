/**
 * This file contains
 * the Schema definition for consignment
 *
 * @author M. Thivagar
 * Last Modified 01/05/2020
 */

const mongoose = require("mongoose");

const consignmentSchema = mongoose.Schema({
  Business_Date: String,
  Contract_Date: String,
  Contract_Number: String,
  Company_Name: String,
  Status: String,
  Material: String,
  On_Board_Date: String,
  Month: String,
  Price: Number,
  Origin: String,
  Payment_Terms: String,
  Advance_To_Be_Paid: Number,
  Advance_Paid_Date: String,
  Contract_Quantity_MT: String,
  Invoice_Date: String,
  Invoice_Paid_Date: String,
  Invoice_Number: String,
  Payment_Duration: String,
  Shipped_Quantity_MT: Number,
  Invoice_Value: Number,
  Containers: Number,
  Container_Numbers: String,
  OB_L_Date: String,
  B_L_Number: String,
  Loading_Port: String,
  Shipping_Line: String,
  ETA: String,
  Discharge_Date: String,
  Place_Of_Delivery: String,
  PSIC_Courier_Details: String,
  DHL_Details: String,
  Sailing_Time: Number,
  Origin: String,
});

const Consignment = mongoose.model("consignmentDetails", consignmentSchema);

module.exports = Consignment;
