import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { AddConsignmentDetailsComponent } from "./components/add-consignment-details/add-consignment-details.component";
import { ConsignmentDetailsComponent } from "./components/consignment-details/consignment-details.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegistrationComponent },
  { path: "consignment/retrieve", component: AddConsignmentDetailsComponent },
  { path: "consignment/add", component: AddConsignmentDetailsComponent },
  { path: "consignment", component: ConsignmentDetailsComponent },
  { path: "", component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
