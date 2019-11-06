import { Component, OnInit } from "@angular/core";
import { HelperValuesService } from "../services/helper-values.service";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"]
})
export class NotFoundComponent implements OnInit {
  constructor(public helperService: HelperValuesService) {}

  ngOnInit() {}
}
