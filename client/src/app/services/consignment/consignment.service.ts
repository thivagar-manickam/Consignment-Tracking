import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../api.service";

import {
  BASE_URL,
  URL,
  OBJ,
  TOKEN,
  CONSIGNMENT_GET_URL,
  CONSIGNMENT_PUT_URL,
  CONSIGNMENT_POST_URL,
  USER_ID,
} from "../../utils/constants.js";

@Injectable({
  providedIn: "root",
})
export class ConsignmentService {
  consignmentDetails = {};
  constructor(private _apiService: ApiService) {}

  /**
   * This method will return
   * the consignment details
   *
   * @returns object
   */
  getConsignmentDetail() {
    return this.consignmentDetails;
  }

  /**
   * This method will update the
   * consignment details
   * @param res
   */
  updateConsignmentDetail(res) {
    this.consignmentDetails = res.data;
  }

  /**
   * This method will clear the
   * saved consignment details
   */
  clearConsignmentDetail() {
    this.consignmentDetails = {};
  }

  /**
   * This method will retrive the
   * consignment detail based
   * the contract number
   * @param data
   * @param isAddToken
   */
  onRetrieveConsignmentDetail(data, isAddToken): Observable<any> {
    let request = {};
    request[
      URL
    ] = `${BASE_URL}/${CONSIGNMENT_GET_URL}/${data.obj.consignmentNumber}`;
    request[OBJ] = data.userId;
    request[TOKEN] = data.token;
    return this._apiService.getData(request, isAddToken);
  }

  /**
   * This method will update the consignment
   * based on the consignment Id
   * @param data
   * @param isAddToken
   */
  onUpdateConsignment(data, isAddToken): Observable<any> {
    let request = {};
    request[URL] = `${BASE_URL}/${CONSIGNMENT_PUT_URL}/${data.consignmentId}`;
    request[TOKEN] = data.token;
    request[OBJ] = data.obj;
    return this._apiService.updateData(request, isAddToken);
  }

  /**
   * This method will create
   * a new conginment entry
   * @param data
   * @param isAddToken
   */
  onCreateConsignment(query, isAddToken): Observable<any> {
    let request = {};
    request[URL] = `${BASE_URL}/${CONSIGNMENT_POST_URL}`;
    request[TOKEN] = query.token;
    request[OBJ] = query.obj;
    return this._apiService.postData(request, isAddToken);
  }
}
