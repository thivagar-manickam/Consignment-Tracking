import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";

// UI Files import
import { LoginComponent } from "./components/login/login.component";
import { ConsignmentDetailsComponent } from "./components/consignment-details/consignment-details.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MaterialModule } from "./material";
import { MenubarComponent } from "./components/menubar/menubar.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConsignmentDetailsComponent,
    RegistrationComponent,
    MenubarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
