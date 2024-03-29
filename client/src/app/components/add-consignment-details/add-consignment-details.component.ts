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
  RETRIEVING_CONTRACT_NUMBERS,
} from "../../utils/constants.js";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

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
  dischargeDateFilter;
  etaDateFilter;
  isNewConsignment = true;
  userDetails;
  consignmentDetail;
  spinnerMessage;
  statusValues = STATUS;
  contractNumbers = [];
  filteredContract: Observable<string[]>;

  consignmentNumberForm = this.consignmentNumberFormBuilder.group({
    consignmentNumber: ["", Validators.required],
  });

  contractForm = this.consignmentFormBuilder.group({
    Contract_Number: ["", Validators.required],
    Contract_Date: [new Date(), Validators.required],
    Business_Date: [new Date(), Validators.required],
    Company_Name: ["", Validators.required],
    Month: [""],
    Status: [this.statusValues[0], Validators.required],
    Material: ["", Validators.required],
    Price: [, Validators.required],
    Origin: ["", Validators.required],
    Payment_Terms: [""],
    Payment_Duration: [""],
    Advance_To_Be_Paid: [""],
    Advance_Paid_Date: [""],
    Contract_Quantity_MT: [""],
    Invoice_Date: [""],
    Invoice_Number: [""],
    Invoice_Paid_Date: [""],
    Invoice_Value: [""],
    Shipped_Quantity_MT: [""],
    Containers: [""],
    Container_Numbers: [""],
    Loading_Port: [""],
    OB_L_Date: [""],
    B_L_Number: [""],
    PSIC_Courier_Details: [""],
    DHL_Details: [""],
    Shipping_Line: [""],
    ETA: [""],
    Place_Of_Delivery: [""],
    Discharge_Date: [],
    Sailing_Time: [""],
    On_Board_Date: [""],
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

  onAdvancePaidBlur = (event) => {
    if (event.target.valueAsNumber) {
      const advance = event.target.valueAsNumber;
      const invoiceValue = this.contractForm.controls["Invoice_Value"].value;
      const totalValue =
        this.contractForm.controls["Price"].value *
        this.contractForm.controls["Contract_Quantity_MT"].value;
      if (advance > invoiceValue) {
        this.contractForm.controls["Advance_To_Be_Paid"].setValidators(
          Validators.max(invoiceValue)
        );
        this.contractForm.controls[
          "Advance_To_Be_Paid"
        ].updateValueAndValidity();
      } else if (advance > totalValue) {
        this.contractForm.controls["Advance_To_Be_Paid"].setValidators(
          Validators.max(totalValue)
        );
        this.contractForm.controls[
          "Advance_To_Be_Paid"
        ].updateValueAndValidity();
      } else {
        this.contractForm.controls["Advance_To_Be_Paid"].clearValidators();
        this.contractForm.controls[
          "Advance_To_Be_Paid"
        ].updateValueAndValidity();
      }
    }
  };
  /**
   * Method to check if the invoice value
   * is lesser than or equal to the
   * value of price * quantity
   *
   * @param event
   * @returns void
   */
  onInvoiceValueBlur = (event) => {
    if (event.target.valueAsNumber) {
      const invoiceValue = event.target.valueAsNumber;
      const totalValue =
        this.contractForm.controls["Price"].value *
        this.contractForm.controls["Contract_Quantity_MT"].value;
      if (invoiceValue < totalValue) {
        this.contractForm.controls["Invoice_Value"].clearValidators();
        this.contractForm.controls["Invoice_Value"].updateValueAndValidity();
      } else {
        this.contractForm.controls["Invoice_Value"].setValidators(
          Validators.max(totalValue)
        );
        this.contractForm.controls["Invoice_Value"].updateValueAndValidity();
      }
    }
  };
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
    } else {
      const title = "Error";
      const message = "Please check all the entered values for error";
      this.showErrorMessage(title, message);
    }
  };

  /**
   * This method will show a error
   * message when there is any error
   * while trying to save the data
   *
   * @param title
   * @param message
   * @void void
   */
  showErrorMessage = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: "error",
      confirmButtonText: "Ok",
      allowOutsideClick: false,
    });
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

  setStartDate = () => {
    if (this.contractForm.controls["ETA"].value) {
      this.dischargeDateFilter = (d: Date | null): boolean => {
        const day = d || new Date();
        const etaDate = new Date(this.contractForm.controls["ETA"].value);
        // Prevent Saturday and Sunday from being selected.
        return day > etaDate;
      };
    } else {
      this.dischargeDateFilter = (d: Date | null): boolean => {
        const day = d || new Date();
        const currentDate = new Date();
        // Prevent Saturday and Sunday from being selected.
        return true;
      };
    }
    if (this.contractForm.controls["On_Board_Date"].value) {
      this.etaDateFilter = (d: Date | null): boolean => {
        const day = d || new Date();
        const onBoardDate = new Date(
          this.contractForm.controls["On_Board_Date"].value
        );
        // Prevent Saturday and Sunday from being selected.
        return day > onBoardDate;
      };
    } else {
      this.etaDateFilter = (d: Date | null): boolean => {
        const day = d || new Date();
        const onBoardDate = new Date();
        // Prevent Saturday and Sunday from being selected.
        return true;
      };
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
      Origin: consignmentDetails["Origin"],
      Payment_Terms: consignmentDetails["Payment_Terms"],
      Advance_To_Be_Paid: consignmentDetails["Advance_To_Be_Paid"],
      Contract_Quantity_MT: consignmentDetails["Contract_Quantity_MT"],
      Invoice_Number: consignmentDetails["Invoice_Number"],
      Invoice_Value: consignmentDetails["Invoice_Value"],
      Payment_Duration: consignmentDetails["Payment_Duration"],
      Shipped_Quantity_MT: consignmentDetails["Shipped_Quantity_MT"],
      Containers: consignmentDetails["Containers"],
      Container_Numbers: consignmentDetails["Container_Numbers"],
      Loading_Port: consignmentDetails["Loading_Port"],
      B_L_Number: consignmentDetails["B_L_Number"],
      PSIC_Courier_Details: consignmentDetails["PSIC_Courier_Details"],
      DHL_Details: consignmentDetails["DHL_Details"],
      Shipping_Line: consignmentDetails["Shipping_Line"],
      Place_Of_Delivery: consignmentDetails["Place_Of_Delivery"],
      Sailing_Time: consignmentDetails["Sailing_Time"],
    });
    if (consignmentDetails["Advance_Paid_Date"]) {
      this.contractForm.patchValue({
        Advance_Paid_Date: new Date(consignmentDetails["Advance_Paid_Date"]),
      });
    }
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
    this.setStartDate();
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
      Origin: "",
      Payment_Terms: "",
      Advance_To_Be_Paid: 0,
      Advance_Paid_Date: "",
      Contract_Quantity_MT: 0,
      Invoice_Date: "",
      Invoice_Number: "",
      Invoice_Value: "",
      Shipped_Quantity_MT: 0,
      Containers: 0,
      Container_Numbers: "",
      Loading_Port: "",
      OB_L_Date: "",
      B_L_Number: "",
      PSIC_Courier_Details: "",
      DHL_Details: "",
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

  fetchConsignmentNumbers = () => {
    this.consignmentNumberForm
      .get("consignmentNumber")
      .valueChanges.subscribe((value) => {
        if (value.length === 3) {
          let request = {};
          request[TOKEN] = this.userDetails.token;
          request[USER_ID] = this.userDetails.userId;
          request["searchTerm"] = value;
          this.spinnerMessage = RETRIEVING_CONTRACT_NUMBERS;
          this.spinnerService.show();
          let response = this._consignmentService.onRetrieveContractNumbers(
            request,
            IS_ADD_TOKEN
          );
          response.subscribe((res) => {
            let responseValue = JSON.parse(JSON.stringify(res));
            if (responseValue.success && responseValue.statusCode === 200) {
              this.contractNumbers = [];
              responseValue.data.forEach((value) => {
                this.contractNumbers.push(value.Contract_Number);
              });
            }
            this.spinnerService.hide();
          });
        }
      });
  };
  /**
   * This method will filter the
   * consignment numbers from the array
   * as we type through
   *
   * @param value
   * @returns void
   */
  filterConsignmentNumber = (value) => {
    if (value) {
      const filterValue = value.consignmentNumber.toLowerCase();

      return this.contractNumbers.filter((option) =>
        option.toLowerCase().includes(filterValue)
      );
    }
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
      this.filteredContract = this.consignmentNumberForm.valueChanges.pipe(
        startWith(""),
        map((value) => this.filterConsignmentNumber(value))
      );
      this.fetchConsignmentNumbers();
    }
  }
}
