import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthenticationService } from "../../services/authentication/authentication.service";
import { LOGIN_ERROR_MESSAGE, CONSIGNMENT } from "../../utils/constants.js";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  errorMessage = "";
  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });

  constructor(
    private router: Router,
    private _authentication: AuthenticationService
  ) {}

  /**
   * This method will get the login details
   * and send the request to Server to validate
   * the user credentials
   *
   * @param userData
   * @returns Void
   */
  onLogin = (userData) => {
    if (this.loginForm.dirty && this.loginForm.valid) {
      this._authentication.onLogin(userData).subscribe((res) => {
        if (res.success && res.statusCode === 200) {
          this._authentication.updateUserDetail(res);
          this.errorMessage = "";
          this.router.navigateByUrl(CONSIGNMENT);
        } else {
          this.errorMessage = LOGIN_ERROR_MESSAGE;
        }
      });
    }
  };
}
