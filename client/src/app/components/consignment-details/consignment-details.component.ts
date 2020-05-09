import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material";

import { AuthenticationService } from "../../services/authentication/authentication.service";
import { ConsignmentService } from "../../services/consignment/consignment.service";
import { NgxSpinnerService } from "ngx-spinner";

import {
  CONSIGNMENT_TABLE_DEF,
  LOGIN_USER_URL,
  RETRIEVING_DATA,
  USER_ID,
  TOKEN,
  IS_ADD_TOKEN,
} from "../../utils/constants.js";
@Component({
  selector: "app-consignment-details",
  templateUrl: "./consignment-details.component.html",
  styleUrls: ["./consignment-details.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ConsignmentDetailsComponent implements OnInit {
  spinnerMessage = "";
  errorMessage = "";
  userDetails;
  columnsToDisplay = CONSIGNMENT_TABLE_DEF;
  consignmentTableSource;
  consignmentData: ConsignementColumns | null;

  constructor(
    private router: Router,
    private _authenticationService: AuthenticationService,
    private _consignmentService: ConsignmentService,
    private spinnerService: NgxSpinnerService
  ) {}

  /**
   * This method is used to invoke the
   * route to fetch all the consignment
   * details and set the table source
   * data to display the details
   *
   * @returns void
   */
  fetchConsignmentDetails = () => {
    let request = {};
    request[USER_ID] = this.userDetails.userId;
    request[TOKEN] = this.userDetails.token;
    this._consignmentService
      .retrieveAllConsignmentDetails(request, IS_ADD_TOKEN)
      .subscribe((res) => {
        let response = JSON.parse(JSON.stringify(res));
        if (response.success && response.statusCode === 200) {
          let EXPANDED_DATA: ConsignementColumns[] = response.data;
          this.consignmentTableSource = EXPANDED_DATA;
        } else if (!response.success && response.statusCode === 401) {
          this.errorMessage = response.message;
          setTimeout(() => {
            this.router.navigateByUrl(LOGIN_USER_URL);
          }, 2000);
        } else {
          this.errorMessage = response.message;
        }
        this.spinnerService.hide();
      });
  };

  ngOnInit() {
    if (!this._authenticationService.getUserDetail().isUserAuthenticated) {
      this.router.navigateByUrl(LOGIN_USER_URL);
    } else {
      this.userDetails = this._authenticationService.getUserDetail();
      this.spinnerMessage = RETRIEVING_DATA;
      this.spinnerService.show();
      this.fetchConsignmentDetails();
    }
  }
}

export interface ConsignementColumns {
  Status: string;
}
