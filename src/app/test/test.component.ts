import { Component, OnInit, HostListener } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class TestComponent implements OnInit {
  details: string;
  isAvailable: boolean;

  constructor(private httpClient: HttpClient) {
    this.httpClient
      .get("http://web.tmrc1.ga/api/getContentsByUrl/?countryCode=pk&url=microsoft-azure")
      .subscribe((res: any) => {
        this.details = unescape(res.Details);
        this.isAvailable = true;
        // /console.log(this.details);
        let a = this.details.replace(/<p><img(.*?)><\/p>/g, value => {
          return value.replace(/<\/?p>/g, "");
        });
        console.log("Print a.... 00000000000000000000000000000000000000000000000");
        console.log(a);
      });
  }
  ngOnInit() {}
}
