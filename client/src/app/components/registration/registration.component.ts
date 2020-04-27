import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import {
  REGISTER_SUCCESS_MESSAGE,
  REGISTER_ERROR_MESSAGE
} from "../../utils/constants.js";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"]
})
export class RegistrationComponent {
  errorMessage = "";
  registerForm = new FormGroup({
    username: new FormControl("", Validators.required),
    newPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15)
    ]),
    confirmPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15)
    ])
  });
  constructor(private router: Router, private _snackbar: MatSnackBar) {}

  onRegister = userData => {
    if (userData.newPassword === userData.confirmPassword) {
      let snackBar = this._snackbar.open(REGISTER_SUCCESS_MESSAGE, "Dismiss", {
        duration: 1500
      });
      snackBar.onAction().subscribe(() => {
        this._snackbar.dismiss();
        this.router.navigateByUrl("login");
      });
      snackBar.afterDismissed().subscribe(() => {
        this.router.navigateByUrl("login");
      });
      this.errorMessage = "";
    } else {
      this.errorMessage = REGISTER_ERROR_MESSAGE;
    }
  };
}
