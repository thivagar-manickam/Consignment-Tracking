import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as XLSX from "xlsx";

import {
  CONSIGNMENT,
  NEW_CONSIGNMENT_TITLE,
  EDIT_CONSIGNMENT_TITLE,
  CONSIGNMENT_DETAILS,
} from "../../utils/constants.js";

@Component({
  selector: "app-consignment-details",
  templateUrl: "./consignment-details.component.html",
  styleUrls: ["./consignment-details.component.scss"],
})
export class ConsignmentDetailsComponent implements OnInit {
  screenTitle = "Add New Consignment";
  errorMessage = "";
  isNewConsignment = true;
  uploadFile;

  consignmentNumberForm = new FormGroup({
    consignmentNumber: new FormControl("", Validators.required),
  });

  fileUpload = new FormGroup({
    fileInput: new FormControl(),
  });

  contractForm = new FormGroup({
    contractNumber: new FormControl("", Validators.required),
    contractDate: new FormControl(new Date(), Validators.required),
    businessDate: new FormControl(new Date(), Validators.required),
    companyName: new FormControl("", Validators.required),
    material: new FormControl("", Validators.required),
    price: new FormControl(0, Validators.required),
    quantity: new FormControl(0, Validators.required),
    paymentTerms: new FormControl("", Validators.required),
    advancePaid: new FormControl(0),
    advancePaidDate: new FormControl(),
    contractQuantity: new FormControl(0),
    invoiceDate: new FormControl(new Date()),
    invoiceNumber: new FormControl(""),
    invoiceValue: new FormControl(),
    shippingQuantity: new FormControl(0, Validators.required),
    noOfContainers: new FormControl(0, Validators.required),
    containerNumber: new FormControl(""),
    loadingPort: new FormControl(""),
    oblDate: new FormControl(new Date()),
    oblNumber: new FormControl(""),
    psicDetail: new FormControl(""),
    dhlDetail: new FormControl(""),
    shippingLine: new FormControl(""),
    eta: new FormControl(),
    placeOfDelivery: new FormControl(""),
    dischargeDate: new FormControl(new Date()),
    sailingTime: new FormControl(""),
  });

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  /**
   * This method will get the form
   * data and send it to the BE
   * for saving in the database
   * @param data
   * @returns void
   */
  onFormSubmit = (data) => {
    console.log(data);
  };

  /**
   * This method will get the
   * consignement details based on the
   */
  onRetrieveDetail = (data) => {
    CONSIGNMENT_DETAILS.forEach((value) => {
      if (value.contractNumber === data.consignmentNumber) {
        this.contractForm.setValue(value);
      }
    });
  };

  ngOnInit() {
    if (this.activatedRoute.snapshot.routeConfig.path === CONSIGNMENT) {
      this.isNewConsignment = true;
      this.screenTitle = NEW_CONSIGNMENT_TITLE;
    } else {
      this.isNewConsignment = false;
      this.screenTitle = EDIT_CONSIGNMENT_TITLE;
    }
  }
}
