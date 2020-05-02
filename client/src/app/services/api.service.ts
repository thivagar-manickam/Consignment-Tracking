import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  headers = new HttpHeaders()
    .set("Content-Type", "application/json;charset=utf-8")
    .set("Accept-Language", "en_US")
    .set("Accept", "application/json");
  constructor(private httpClient: HttpClient) {}

  /**
   * This method will set the token in
   * the authorization header
   *
   * @param token
   */
  setAuthorizationHeader = (token, isBearer) => {
    this.headers = this.headers.delete("Authorization");
    if (isBearer) {
      return this.headers.append("Authorization", `Bearer ${token}`);
    } else {
      return this.headers.append("Authorization", `${token}`);
    }
  };

  /**
   * This is the method invoked
   * to login a user into the
   * application
   *
   * @param req
   * @returns Object
   */
  loginUser = (req) => {
    return this.httpClient.post(req.URL, req.obj, { headers: this.headers });
  };

  /**
   * This is the method invoked
   * to register a new user
   *
   * @param req
   * @returns Object
   */
  registerUser = (req) => {
    return this.httpClient.post(req.URL, req.obj, { headers: this.headers });
  };

  /**
   * This method will be invoked
   * when a user clicks on logout
   * button
   *
   * @param req
   * @returns Object
   */
  logoutUser = (req) => {
    return this.httpClient.post(req.URL, req, { headers: this.headers });
  };

  /**
   * This is a common method to
   * fetch any data from the server
   *
   * @param req
   * @param isAddToken
   *
   * @returns Object
   */
  getData = (req, isAddToken) => {
    if (isAddToken) {
      this.headers = this.setAuthorizationHeader(req.token, true);
    }
    return this.httpClient.get(req.URL, {
      headers: this.headers,
      params: { obj: req.obj },
    });
  };

  /**
   * This is a common method to
   * add / create a new data in
   * the application
   *
   * @param req
   * @param isAddToken
   *
   * @returns Object
   */
  postData = (req, isAddToken = false) => {
    if (isAddToken) {
      this.headers = this.setAuthorizationHeader(req.token, false);
    }
    return this.httpClient.post(req.URL, req, { headers: this.headers });
  };

  /**
   * This is a common method to
   * update the data in the application
   * @param req
   * @param isAddToken
   *
   * @returns Object
   */
  updateData = (req, isAddToken = false) => {
    if (isAddToken) {
      this.headers = this.setAuthorizationHeader(req.token, false);
    }
    return this.httpClient.put(req.URL, req, { headers: this.headers });
  };
}
