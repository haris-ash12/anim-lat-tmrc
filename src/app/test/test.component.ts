import { Component, OnInit, HostListener } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"]
})
export class TestComponent implements OnInit {
  details: string;

  constructor(private httpClient: HttpClient) {
    this.httpClient
      .get("http://web.tmrc1.ga/api/getContentsByUrl/?countryCode=pk&url=microsoft-azure")
      .subscribe((res: any) => {
        this.details = unescape(res.Details);
        console.log(this.details);
      });
  }
  ngOnInit() {}
}
