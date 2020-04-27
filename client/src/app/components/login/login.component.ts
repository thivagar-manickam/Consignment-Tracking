import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import {
  USER_NAME,
  PASSWORD,
  LOGIN_ERROR_MESSAGE
} from "../../utils/constants.js";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  errorMessage = "";
  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  constructor(private router: Router) {}

  /**
   * This method will get the login details
   * and send the request to Server to validate
   * the user credentials
   *
   * @param userData
   * @returns Void
   */
  onLogin = userData => {
    if (userData.username === USER_NAME && userData.password === PASSWORD) {
      this.errorMessage = "";
      this.router.navigateByUrl("consignment");
    } else {
      this.errorMessage = LOGIN_ERROR_MESSAGE;
    }
  };
}
