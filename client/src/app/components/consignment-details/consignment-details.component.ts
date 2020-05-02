import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormGroupDirective } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { ConsignmentService } from "../../services/consignment/consignment.service";

import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

import {
  CONSIGNMENT,
  NEW_CONSIGNMENT_TITLE,
  EDIT_CONSIGNMENT_TITLE,
  USER_ID,
  TOKEN,
  IS_ADD_TOKEN,
  LOGIN_USER_URL,
  OBJ,
  CONSIGNMENT_ID,
  RETRIEVING_DATA,
  SAVING_CONSIGNMENT_DETAILS,
} from "../../utils/constants.js";

@Component({
  selector: "app-consignment-details",
  templateUrl: "./consignment-details.component.html",
  styleUrls: ["./consignment-details.component.scss"],
})
export class ConsignmentDetailsComponent implements OnInit {
  @ViewChild(FormGroupDirective, null) form;

  screenTitle = "Add New Consignment";
  errorMessage = "";
  isNewConsignment = true;
  userDetails;
  consignmentDetail;
  spinnerMessage;

  consignmentNumberForm = this.consignmentNumberFormBuilder.group({
    consignmentNumber: ["", Validators.required],
  });

  contractForm = this.consignmentFormBuilder.group({
    "Contract Number": ["", Validators.required],
    "Contract Date": [new Date(), Validators.required],
    "Business Date": [new Date(), Validators.required],
    "Company Name": ["", Validators.required],
    Material: ["", Validators.required],
    Price: [0, Validators.required],
    Quantity: [0, Validators.required],
    "Payment Terms": ["", Validators.required],
    "Advance To Be Paid": [0],
    "Advance Paid Date": [],
    "Contract Quantity (MT)": [0],
    "Invoice Date": [new Date()],
    "Invoice Number": [""],
    "Invoice Price": [],
    "Shipped Quantity (MT)": [0, Validators.required],
    Containers: [0, Validators.required],
    "Container Numbers": [""],
    "Loading Port": [""],
    "OB/L Date": [new Date()],
    "B/L Number": [""],
    "PSIC Courier Details": [""],
    "DHL / Delivery Date": [""],
    "Shipping Line": [""],
    ETA: [],
    "Place Of Delivery": [""],
    "Discharge Date": [new Date()],
    "Sailing Time": [""],
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _authenticationService: AuthenticationService,
    private _consignmentService: ConsignmentService,
    private consignmentFormBuilder: FormBuilder,
    private consignmentNumberFormBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService
  ) {}

  /**
   * This method will get the form
   * data and send it to the BE
   * for saving in the database
   * @param form
   * @returns void
   */
  onFormSubmit = (form) => {
    if (this.contractForm.dirty && this.contractForm.valid) {
      let request = {};
      const obj = form.getRawValue();
      obj[USER_ID] = this.userDetails.userId;
      request[TOKEN] = this.userDetails.token;
      request[OBJ] = obj;
      let response;

      this.spinnerMessage = RETRIEVING_DATA;
      this.spinnerService.show();
      if (this.isNewConsignment) {
        response = this._consignmentService.onCreateConsignment(
          request,
          IS_ADD_TOKEN
        );
      } else {
        request[CONSIGNMENT_ID] = this.consignmentDetail._id;
        response = this._consignmentService.onUpdateConsignment(
          request,
          IS_ADD_TOKEN
        );
      }

      response.subscribe((res) => {
        let responseValue = JSON.parse(JSON.stringify(res));
        if (responseValue.success && responseValue.statusCode === 200) {
          this.errorMessage = "";
          this.showSuccessMessage(responseValue.message);
        } else if (!responseValue.success && responseValue.statusCode === 401) {
          this.errorMessage = responseValue.message;
          setTimeout(() => {
            this.router.navigateByUrl(LOGIN_USER_URL);
          }, 2000);
        } else {
          this.errorMessage = responseValue.message;
        }
        this.spinnerService.hide();
      });
    }
  };

  /**
   * This method will show the alert
   * message on successfully saving the
   * transaction
   *
   * @param message
   * @returns void
   */
  showSuccessMessage = (message) => {
    Swal.fire({
      text: message,
      icon: "success",
      confirmButtonText: "Ok",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.value) {
        this.errorMessage = "";
        if (!this.isNewConsignment) {
          this.form.resetForm({
            consignmentNumber: "",
          });
        }
        this.resetFormValues();
      }
    });
  };

  /**
   * This method will get the
   * consignement details based on the
   */
  onRetrieveDetail = (data) => {
    if (this.consignmentNumberForm.dirty && this.consignmentNumberForm.valid) {
      let request = {};
      request[USER_ID] = this.userDetails.userId;
      request[TOKEN] = this.userDetails.token;
      const obj = data.getRawValue();
      obj.consignmentNumber = obj.consignmentNumber.trim();
      request[OBJ] = obj;
      this.spinnerMessage = RETRIEVING_DATA;
      this.spinnerService.show();
      this._consignmentService
        .onRetrieveConsignmentDetail(request, IS_ADD_TOKEN)
        .subscribe((res) => {
          let responseValue = JSON.parse(JSON.stringify(res));
          if (responseValue.success && responseValue.statusCode === 200) {
            if (responseValue.data) {
              this.errorMessage = "";
              this.consignmentDetail = responseValue.data;
              this.setFormValues(this.consignmentDetail);
            } else {
              this.errorMessage = responseValue.message;
            }
          } else if (
            !responseValue.success &&
            responseValue.statusCode === 401
          ) {
            this.errorMessage = responseValue.message;
            setTimeout(() => {
              this.router.navigateByUrl(LOGIN_USER_URL);
            }, 2000);
          } else {
            this.errorMessage = responseValue.message;
          }
          this.spinnerService.hide();
        });
    }
  };

  /**
   * This method will set the
   * form values on retrieving the
   * consignment details
   *
   * @param consignmentDetails
   */
  setFormValues = (consignmentDetails) => {
    this.contractForm.setValue({
      "Contract Number": consignmentDetails["Contract Number"],
      "Contract Date": new Date(consignmentDetails["Contract Date"]),
      "Business Date": new Date(consignmentDetails["Business Date"]),
      "Company Name": consignmentDetails["Company Name"],
      Material: consignmentDetails["Material"],
      Price: consignmentDetails["Price"],
      Quantity: consignmentDetails["Contract Quantity (MT)"],
      "Payment Terms": consignmentDetails["Payment Terms"],
      "Advance To Be Paid": consignmentDetails["Advance To Be Paid"],
      "Advance Paid Date": consignmentDetails["Advance Paid Date"],
      "Contract Quantity (MT)": consignmentDetails["Contract Quantity (MT)"],
      "Invoice Date": new Date(consignmentDetails["Invoice Date"]),
      "Invoice Number": consignmentDetails["Invoice Number"],
      "Invoice Price": consignmentDetails["Invoice Price"],
      "Shipped Quantity (MT)": consignmentDetails["Shipped Quantity (MT)"],
      Containers: consignmentDetails["Containers"],
      "Container Numbers": consignmentDetails["Container Numbers"],
      "Loading Port": consignmentDetails["Loading Port"],
      "OB/L Date": new Date(consignmentDetails["OB/L Date"]),
      "B/L Number": consignmentDetails["B/L Number"],
      "PSIC Courier Details": consignmentDetails["PSIC Courier Details"],
      "DHL / Delivery Date": consignmentDetails["DHL / Delivery Date"],
      "Shipping Line": consignmentDetails["Shipping Line"],
      ETA: consignmentDetails["ETA"],
      "Place Of Delivery": consignmentDetails["Place Of Delivery"],
      "Discharge Date": new Date(consignmentDetails["Discharge Date"]),
      "Sailing Time": consignmentDetails["Sailing Time"],
    });
  };

  /**
   * This method will reset the form value
   * on submitting the form
   *
   * @returns void
   */
  resetFormValues = () => {
    this.contractForm.reset({
      "Contract Number": "",
      "Contract Date": new Date(),
      "Business Date": new Date(),
      "Company Name": "",
      Material: "",
      Price: 0,
      Quantity: 0,
      "Payment Terms": "",
      "Advance To Be Paid": 0,
      "Advance Paid Date": "",
      "Contract Quantity (MT)": 0,
      "Invoice Date": new Date(),
      "Invoice Number": "",
      "Invoice Price": "",
      "Shipped Quantity (MT)": 0,
      Containers: 0,
      "Container Numbers": "",
      "Loading Port": "",
      "OB/L Date": new Date(),
      "B/L Number": "",
      "PSIC Courier Details": "",
      "DHL / Delivery Date": "",
      "Shipping Line": "",
      ETA: "",
      "Place Of Delivery": "",
      "Discharge Date": new Date(),
      "Sailing Time": "",
    });
    Object.keys(this.contractForm.controls).forEach((key) => {
      this.contractForm.controls[key].setErrors(null);
    });
  };

  ngOnInit() {
    if (!this._authenticationService.getUserDetail().isUserAuthenticated) {
      this.router.navigateByUrl(LOGIN_USER_URL);
    } else {
      if (this.activatedRoute.snapshot.routeConfig.path === CONSIGNMENT) {
        this.isNewConsignment = true;
        this.screenTitle = NEW_CONSIGNMENT_TITLE;
      } else {
        this.isNewConsignment = false;
        this.screenTitle = EDIT_CONSIGNMENT_TITLE;
      }
      this.userDetails = this._authenticationService.getUserDetail();
    }
  }
}
