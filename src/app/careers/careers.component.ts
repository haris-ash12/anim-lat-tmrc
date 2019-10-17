import { Component, OnInit } from "@angular/core";
import { CareersService } from "../services/careers.service";
import { trigger, state, style, transition, animate } from "@angular/animations";

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

  constructor(private careersService: CareersService) {}

  ngOnInit() {
    this.careersService.getAll().subscribe((careersResponse: any[]) => {
      console.log(careersResponse);
      for (let i = 0; i < careersResponse.length; i++) {
        let careersObject = {
          title: careersResponse[i].JobTitle,
          position: careersResponse[i].NoOfPosition,
          cities: careersResponse[i].Cities,
          type: careersResponse[i].JobType,
          slug: careersResponse[i].Slug
        };

        this.careers.push(careersObject);
      }

      // console.log(this.careers);

      this.isAvailable = true;
    });
  }
}
