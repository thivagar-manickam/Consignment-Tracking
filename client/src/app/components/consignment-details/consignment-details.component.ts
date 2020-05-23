import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

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
  DATE_FIELDS,
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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dateFields = DATE_FIELDS;
  spinnerMessage = "";
  errorMessage = "";
  userDetails;
  columnsToDisplay = CONSIGNMENT_TABLE_DEF;
  consignmentTableSource;

  constructor(
    private router: Router,
    private _authenticationService: AuthenticationService,
    private _consignmentService: ConsignmentService,
    private spinnerService: NgxSpinnerService
  ) {}

  /**
   * This method will filter the table
   * based on the search term given
   * in the text input field
   * @param event
   */
  applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.consignmentTableSource.filter = filterValue.trim().toLowerCase();

    if (this.consignmentTableSource.paginator) {
      this.consignmentTableSource.paginator.firstPage();
    }
  };

  /**
   * This method will replace all
   * the underscore(_) to spaces
   * in the grid column header
   *
   * @param value
   */
  replaceUnderScore = (value) => {
    return value.replace(/_/g, " ");
  };

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
          /**
           * To convert the string to date object
           * so that the date pipe operator can
           * display it properly in the grid
           */
          response.data.forEach((data) => {
            Object.keys(data).forEach((value) => {
              if (this.dateFields.indexOf(value) > -1) {
                if (data[value]) data[value] = new Date(data[value]);
              }
            });
          });
          this.consignmentTableSource = new MatTableDataSource(response.data);
          this.consignmentTableSource.paginator = this.paginator;
          this.consignmentTableSource.sort = this.sort;
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
