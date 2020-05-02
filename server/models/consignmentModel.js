/**
 * This file contains
 * the Schema definition for consignment
 *
 * @author M. Thivagar
 * Last Modified 01/05/2020
 */

const mongoose = require("mongoose");

const consignmentSchema = mongoose.Schema({
  "Business Date": String,
  "Contract Date": String,
  "Contract Number": String,
  "Company Name": String,
  Status: String,
  Material: String,
  "On Board Date": String,
  Price: Number,
  "Payment Terms": String,
  "Advance To Be Paid": Number,
  "Advance Paid Date": String,
  "Contract Quantity (MT)": String,
  "Invoice Date": String,
  "Invoice Number": String,
  "Shipped Quantity (MT)": Number,
  "Invoice Price": Number,
  Containers: Number,
  "Container Numbers": String,
  "OB/L Date": String,
  "B/L Number": String,
  "Loading Port": String,
  "Shipping Line": String,
  ETA: String,
  "Discharge Date": String,
  "Place Of Delivery": String,
  "PSIC Courier Details": String,
  "DHL / Delivery Date": String,
  Comments: String,
  "Sailing Time": Number,
});

const Consignment = mongoose.model("consignmentDetails", consignmentSchema);

module.exports = Consignment;
