export const USER_NAME = "admin";
export const PASSWORD = "admin";
export const LOGIN_ERROR_MESSAGE = "Invalid username / password";
export const REGISTER_SUCCESS_MESSAGE = "User registered successfully!!!";
export const REGISTER_ERROR_MESSAGE =
  "New password and Confirm password mismatch";
export const CONSIGNMENT = "consignment";
export const ADD_CONSIGNMENT = "consignment/add";
export const NEW_CONSIGNMENT_TITLE = "Add New Consignment";
export const EDIT_CONSIGNMENT_TITLE = "Update Consignment detail";

export const URL = "URL";
export const TOKEN = "token";
export const REQUEST_METHOD = "requestMethod";
export const OBJ = "obj";
export const USER_ID = "userId";
export const CONSIGNMENT_ID = "consignmentId";
export const MONTH = "Month";

export const RETRIEVING_DATA = "Retrieving consignment details...";
export const SAVING_CONSIGNMENT_DETAILS = "Saving the consignment details...";
export const IS_ADD_TOKEN = true;
export const BASE_URL = "http://localhost:4200/api";
export const LOGIN_USER_URL = "login";
export const REGISTER_USER_URL = "register";
export const LOGOUT_USER_URL = "logout";
export const CONSIGNMENT_GET_URL = "/consignment";
export const CONSIGNMENT_RETRIEVE_URL = "/consignment/get";
export const CONSIGNMENT_PUT_URL = "/consignment/edit";
export const CONSIGNMENT_POST_URL = "/consignment/add";
export const STATUS = [
  "To be Loaded",
  "Documents due",
  "Arriving this week",
  "Payment Due",
  "Cancelled",
  "Discharged",
  "Closed",
];

export const CONSIGNMENT_TABLE_DEF = [
  "Contract_Number",
  "Company_Name",
  "Business_Date",
  "Status",
  "Material",
  "Price",
  "Origin",
];
