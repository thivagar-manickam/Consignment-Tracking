import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "../api.service";

import {
  BASE_URL,
  URL,
  OBJ,
  REGISTER_USER_URL,
  LOGIN_USER_URL,
} from "../../utils/constants.js";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  userDetails = { isUserAuthenticated: false };
  constructor(private _apiService: ApiService) {}

  /**
   * This method will return the user detail
   * object with the token, userId and isUserAuthenticated
   * flag
   *
   * @returns Object
   */
  getUserDetail = () => {
    return this.userDetails;
  };

  /**
   * This method will update the user detail
   * object with the token, userId and
   * isUserAuthenticated flag
   * @param userData
   * @returns {void}
   */
  updateUserDetail = (res) => {
    this.userDetails = res.data;
  };

  /**
   * This method will clear the token and
   * userId and set the isUserAuthenticated flag
   * to false
   * @returns {void}
   */
  clearUserDetail = () => {
    this.userDetails = { isUserAuthenticated: false };
  };

  /**
   * This method will trigger the API
   * request to logout the user from the
   * application
   * @param userData
   */
  onLogout(req): Observable<any> {
    return this._apiService.logoutUser(req);
  }
  /**
   * This method will trigger the API
   * request to login the user based on
   * the credentials provided
   * @param userData
   * @returns {Object}
   */
  onLogin(userData): Observable<any> {
    let request = {};
    request[URL] = `${BASE_URL}/${LOGIN_USER_URL}`;
    request[OBJ] = userData;
    return this._apiService.loginUser(request);
  }

  /**
   * This method will trigger the API to
   * register a new user with the details
   * provided in the form
   * @param userData
   * @returns {Object}
   */
  onRegister(userData): Observable<any> {
    let request = {};
    request[URL] = `${BASE_URL}/${REGISTER_USER_URL}`;
    request[OBJ] = userData;
    return this._apiService.registerUser(request);
  }
}
