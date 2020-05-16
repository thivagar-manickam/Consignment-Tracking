import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormGroupDirective } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { ConsignmentService } from "../../services/consignment/consignment.service";

import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

import {
  AppDateAdapter,
  APP_DATE_FORMATS,
} from "../../utils/format-datepicker";

import {
  ADD_CONSIGNMENT,
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
  STATUS,
  MONTH,
} from "../../utils/constants.js";

@Component({
  selector: "app-consignment-details",
  templateUrl: "./add-consignment-details.component.html",
  styleUrls: ["./add-consignment-details.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class AddConsignmentDetailsComponent implements OnInit {
  @ViewChild(FormGroupDirective, null) form;

  screenTitle = "Add New Consignment";
  errorMessage = "";
  isNewConsignment = true;
  userDetails;
  consignmentDetail;
  spinnerMessage;
  statusValues = STATUS;

  consignmentNumberForm = this.consignmentNumberFormBuilder.group({
    consignmentNumber: ["", Validators.required],
  });

  contractForm = this.consignmentFormBuilder.group({
    Contract_Number: ["", Validators.required],
    Contract_Date: [new Date(), Validators.required],
    Business_Date: [new Date(), Validators.required],
    Company_Name: ["", Validators.required],
    Month: [""],
    Status: [""],
    Material: ["", Validators.required],
    Price: [0, Validators.required],
    Payment_Terms: [""],
    Payment_Duration: [""],
    Advance_To_Be_Paid: [0],
    Advance_Paid_Date: [],
    Contract_Quantity_MT: [0],
    Invoice_Date: [],
    Invoice_Number: [""],
    Invoice_Paid_Date: [],
    Invoice_Price: [],
    Shipped_Quantity_MT: [0],
    Containers: [0],
    Container_Numbers: [""],
    Loading_Port: [""],
    OB_L_Date: [],
    B_L_Number: [""],
    PSIC_Courier_Details: [""],
    DHL_Delivery_Date: [""],
    Shipping_Line: [""],
    ETA: [],
    Place_Of_Delivery: [""],
    Discharge_Date: [],
    Sailing_Time: [""],
    On_Board_Date: [],
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
      obj[MONTH] = new Date().toLocaleString("default", { month: "short" });
      obj[USER_ID] = this.userDetails.userId;
      request[TOKEN] = this.userDetails.token;
      request[OBJ] = obj;
      let response;

      this.spinnerMessage = SAVING_CONSIGNMENT_DETAILS;
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
      request[TOKEN] = this.userDetails.token;
      const obj = data.getRawValue();
      obj.consignmentNumber = obj.consignmentNumber.trim();
      obj[USER_ID] = this.userDetails.userId;
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
    this.contractForm.patchValue({
      Contract_Number: consignmentDetails["Contract_Number"],
      Contract_Date: new Date(consignmentDetails["Contract_Date"]),
      Business_Date: new Date(consignmentDetails["Business_Date"]),
      Company_Name: consignmentDetails["Company_Name"],
      Status: consignmentDetails["Status"],
      Month: consignmentDetails["Month"],
      Material: consignmentDetails["Material"],
      Price: consignmentDetails["Price"],
      Payment_Terms: consignmentDetails["Payment_Terms"],
      Advance_To_Be_Paid: consignmentDetails["Advance_To_Be_Paid"],
      Advance_Paid_Date: consignmentDetails["Advance_Paid_Date"],
      Contract_Quantity_MT: consignmentDetails["Contract_Quantity_MT"],
      Invoice_Number: consignmentDetails["Invoice_Number"],
      Invoice_Price: consignmentDetails["Invoice_Price"],
      Payment_Duration: consignmentDetails["Payment_Duration"],
      Shipped_Quantity_MT: consignmentDetails["Shipped_Quantity_MT"],
      Containers: consignmentDetails["Containers"],
      Container_Numbers: consignmentDetails["Container_Numbers"],
      Loading_Port: consignmentDetails["Loading_Port"],
      B_L_Number: consignmentDetails["B_L_Number"],
      PSIC_Courier_Details: consignmentDetails["PSIC_Courier_Details"],
      DHL_Delivery_Date: consignmentDetails["DHL_Delivery_Date"],
      Shipping_Line: consignmentDetails["Shipping_Line"],
      Place_Of_Delivery: consignmentDetails["Place_Of_Delivery"],
      Sailing_Time: consignmentDetails["Sailing_Time"],
    });
    if (consignmentDetails["Invoice_Date"]) {
      this.contractForm.patchValue({
        Invoice_Date: new Date(consignmentDetails["Invoice_Date"]),
      });
    }
    if (consignmentDetails["Discharge_Date"]) {
      this.contractForm.patchValue({
        Discharge_Date: new Date(consignmentDetails["Discharge_Date"]),
      });
    }
    if (consignmentDetails["ETA"]) {
      this.contractForm.patchValue({
        ETA: new Date(consignmentDetails["ETA"]),
      });
    }
    if (consignmentDetails["OB_L_Date"]) {
      this.contractForm.patchValue({
        OB_L_Date: new Date(consignmentDetails["OB_L_Date"]),
      });
    }
    if (consignmentDetails["Invoice_Paid_Date"]) {
      this.contractForm.patchValue({
        Invoice_Paid_Date: new Date(consignmentDetails["Invoice_Paid_Date"]),
      });
    }
    if (consignmentDetails["On_Board_Date"]) {
      this.contractForm.patchValue({
        On_Board_Date: new Date(consignmentDetails["On_Board_Date"]),
      });
    }
  };

  /**
   * This method will reset the form value
   * on submitting the form
   *
   * @returns void
   */
  resetFormValues = () => {
    this.contractForm.reset({
      Contract_Number: "",
      Contract_Date: new Date(),
      Business_Date: new Date(),
      Company_Name: "",
      Status: "",
      Material: "",
      Month: "",
      Price: 0,
      Payment_Terms: "",
      Advance_To_Be_Paid: 0,
      Advance_Paid_Date: "",
      Contract_Quantity_MT: 0,
      Invoice_Date: "",
      Invoice_Number: "",
      Invoice_Price: "",
      Shipped_Quantity_MT: 0,
      Containers: 0,
      Container_Numbers: "",
      Loading_Port: "",
      OB_L_Date: "",
      B_L_Number: "",
      PSIC_Courier_Details: "",
      DHL_Delivery_Date: "",
      Shipping_Line: "",
      ETA: "",
      Place_Of_Delivery: "",
      Discharge_Date: "",
      Sailing_Time: "",
    });
    Object.keys(this.contractForm.controls).forEach((key) => {
      this.contractForm.controls[key].setErrors(null);
    });
  };

  ngOnInit() {
    if (!this._authenticationService.getUserDetail().isUserAuthenticated) {
      this.router.navigateByUrl(LOGIN_USER_URL);
    } else {
      if (this.activatedRoute.snapshot.routeConfig.path === ADD_CONSIGNMENT) {
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
