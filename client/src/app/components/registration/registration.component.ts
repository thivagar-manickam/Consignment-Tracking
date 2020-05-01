import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthenticationService } from "../../services/authentication/authentication.service";

import {
  REGISTER_SUCCESS_MESSAGE,
  REGISTER_ERROR_MESSAGE,
  LOGIN_USER_URL,
} from "../../utils/constants.js";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent {
  errorMessage = "";
  registerForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
    confirmPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
    ]),
  });
  constructor(
    private router: Router,
    private _snackbar: MatSnackBar,
    private authentication: AuthenticationService
  ) {}

  onRegister = (userData) => {
    if (this.registerForm.dirty && this.registerForm.valid) {
      if (userData.password === userData.confirmPassword) {
        this.authentication.onRegister(userData).subscribe((res) => {
          if (res.success) {
            let snackBar = this._snackbar.open(
              REGISTER_SUCCESS_MESSAGE,
              "Dismiss",
              {
                duration: 1500,
              }
            );
            snackBar.onAction().subscribe(() => {
              this._snackbar.dismiss();
              this.router.navigateByUrl(LOGIN_USER_URL);
            });
            snackBar.afterDismissed().subscribe(() => {
              this.router.navigateByUrl(LOGIN_USER_URL);
            });
            this.errorMessage = "";
          } else {
            this.errorMessage = res.message;
          }
        });
      } else {
        this.errorMessage = REGISTER_ERROR_MESSAGE;
      }
    }
  };
}
