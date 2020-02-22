import {
  MatInputModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatButtonModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatTabsModule
} from "@angular/material";
import { NgModule } from "@angular/core";

@NgModule({
  imports: [
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTabsModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTabsModule
  ]
})
export class MaterialModule {}
