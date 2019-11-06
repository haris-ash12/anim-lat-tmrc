import { Component, OnInit } from "@angular/core";
import { CareersService } from "../services/careers.service";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { HelperValuesService } from "../services/helper-values.service";

@Component({
  selector: "app-careers",
  templateUrl: "./careers.component.html",
  styleUrls: ["./careers.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class CareersComponent implements OnInit {
  careers: any[] = [];
  isAvailable: boolean;

  constructor(private careersService: CareersService, public helperService: HelperValuesService) {}

  ngOnInit() {
    this.careersService.getAll().subscribe((careersResponse: any[]) => {
      // console.log(careersResponse);
      for (let i = 0; i < careersResponse.length; i++) {
        let isRedirectionActive: boolean;
        if (!careersResponse[i].RedirectionUrl || !careersResponse[i].RedirectionType) {
          isRedirectionActive = false;
        } else {
          isRedirectionActive = true;
        }

        let careersObject = {
          title: careersResponse[i].JobTitle,
          position: careersResponse[i].NoOfPosition,
          cities: careersResponse[i].Cities,
          type: careersResponse[i].JobType,
          slug: careersResponse[i].Slug,
          redirectionUrl: careersResponse[i].RedirectionUrl,
          redirectionType: careersResponse[i].RedirectionType,
          isRedirectionActive: isRedirectionActive
        };

        this.careers.push(careersObject);
      }

      // console.log("Careers response after changes ...");
      // console.log(this.careers);

      this.isAvailable = true;
    });
  }
}
