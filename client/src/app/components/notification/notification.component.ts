import { Component, OnInit } from "@angular/core";

import { MatBottomSheetRef } from "@angular/material/bottom-sheet";

import { NOTIFICATION_DATA } from "../../utils/constants.js";
@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnInit {
  notificationData = NOTIFICATION_DATA;
  constructor(
    private _notificationSheetRef: MatBottomSheetRef<NotificationComponent>
  ) {}

  onNotificationClick(event: MouseEvent): void {
    this._notificationSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnInit() {}
}
