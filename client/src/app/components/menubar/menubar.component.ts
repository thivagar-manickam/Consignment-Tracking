import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication/authentication.service";
import {
  URL,
  BASE_URL,
  OBJ,
  LOGOUT_USER_URL,
  LOGIN_USER_URL,
} from "../../utils/constants";

@Component({
  selector: "app-menubar",
  templateUrl: "./menubar.component.html",
  styleUrls: ["./menubar.component.scss"],
})
export class MenubarComponent implements OnInit {
  userDetails;
  errorMessage = "";
  constructor(
    private router: Router,
    private _authenticationService: AuthenticationService
  ) {}

  onLogoutClick() {
    let request = {};
    request[URL] = `${BASE_URL}/${LOGOUT_USER_URL}`;
    const obj = {
      token: this.userDetails.token,
      userId: this.userDetails.userId,
    };
    request[OBJ] = obj;
    this._authenticationService.onLogout(request).subscribe((res) => {
      if (res.success && res.statusCode === 200) {
        this._authenticationService.clearUserDetail();
        this.router.navigateByUrl(LOGIN_USER_URL);
        this.errorMessage = "";
      } else if (!res.success && res.statusCode === 401) {
        this.router.navigateByUrl(LOGIN_USER_URL);
        this.errorMessage = "";
      } else {
        this.errorMessage = res.message;
      }
    });
  }

  ngOnInit() {
    if (!this._authenticationService.getUserDetail().isUserAuthenticated) {
      this.router.navigateByUrl(LOGIN_USER_URL);
    } else {
      this.userDetails = this._authenticationService.getUserDetail();
    }
  }
}
