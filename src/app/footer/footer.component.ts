import { Component, OnInit } from "@angular/core";
import { MenuService } from "../services/menus/menu.service";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { SubscriptionService } from "../services/subscription.service";
import { HelperValuesService } from "../services/helper-values.service";
import { CountryService } from "../services/country.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  animations: [
    trigger("subscriptionNewsletter", [
      state("out", style({ opacity: 0, transform: "translateX(300px)" })),
      state("in", style({ opacity: 1 })),
      transition("in => out", animate("500ms ease")),
      transition("out => in", animate("500ms ease"))
    ]),
    trigger("subscriptionThankyou", [
      state(
        "out",
        style({ opacity: 0, transform: "translateX(-300px)", "z-index": -1 })
      ),
      state("in", style({ opacity: 1, transform: "translateX(0px)" })),
      transition("out => in", animate("500ms ease")),
      transition("in => out", animate("500ms ease"))
    ])
  ]
})
export class FooterComponent implements OnInit {
  menus: any[] = [];
  countries: any[] = [];
  isSubscribeClicked: boolean;
  isEmailValid: boolean;
  countryCodeValue: string;

  devices = "one two three".split(" ");
  selectedDevice = "two";
  onChange(newValue) {
    let location = document.location;
    location = location + newValue;
    console.log(newValue + " . " + location);
    this.selectedDevice = newValue;
    // ... do other stuff here ...
  }

  constructor(
    private menuService: MenuService,
    private subscriptionService: SubscriptionService,
    private countryService: CountryService,
    public helperService: HelperValuesService
  ) {
    if (helperService.countryCodeHelperValue === "")
      this.countryCodeValue = "pk";
    else {
      if (this.helperService.countryCodeHelperValue) {
        let ccValue = this.helperService.countryCodeHelperValue.split("/")[1];
        this.countryCodeValue = ccValue;
      }
    }
  }

  ngOnInit() {
    this.countryService.getAll().subscribe((countryResponse: any[]) => {
      for (let i = 0; i < countryResponse.length; i++) {
        let code = countryResponse[i].Code.toLowerCase();
        let isSelected = false;

        if (code === this.countryCodeValue) isSelected = true;
        if (code === "pk") code = "";

        let countryObject = {
          name: countryResponse[i].Name,
          code: code,
          isSelected: isSelected
        };
        this.countries.push(countryObject);
      }

      // console.log(this.countries);
    });

    let parentMenus: any[] = [];

    // call menu service, getData and make logic.
    this.menuService.getAll().subscribe((menus: any[]) => {
      for (let i = 0; i < menus.length; i++) {
        let isRedirectionActive: boolean;
        if (!menus[i].RedirectionUrl || !menus[i].RedirectionType) {
          isRedirectionActive = false;
        } else {
          isRedirectionActive = true;
        }

        if (menus[i].ParentId === 0) {
          let parentMenuObject = {
            id: menus[i].TitleId,
            titleName: menus[i].TitleName,
            slug: menus[i].Slug,
            priority: menus[i].Priority,
            redirectionUrl: menus[i].RedirectionUrl,
            redirectionType: menus[i].RedirectionType,
            isRedirectionActive: isRedirectionActive
          };
          parentMenus.push(parentMenuObject);
        }
      }
      // Log parent menu
      // console.log('Parent Menu ...');
      // console.log(parentMenus);

      for (let i = 0; i < parentMenus.length; i++) {
        let subMenus: any[] = [];
        for (let j = 0; j < menus.length; j++) {
          if (parentMenus[i].id === menus[j].ParentId) {
            // console.log(parentMenus[i].titleName + '......');

            let isRedirectionActive: boolean;
            if (!menus[i].RedirectionUrl || !menus[i].RedirectionType) {
              isRedirectionActive = false;
            } else {
              isRedirectionActive = true;
            }

            let singleChildObject = {
              id: menus[j].TitleId,
              titleName: menus[j].TitleName,
              slug: menus[j].Slug,
              redirectionUrl: menus[i].RedirectionUrl,
              redirectionType: menus[i].RedirectionType,
              isRedirectionActive: isRedirectionActive
            };
            subMenus.push(singleChildObject);

            // console.log('...' + menus[j].TitleName);
          }
        }

        parentMenus[i]["children"] = subMenus;
      }

      // console.log(parentMenus);
      this.menus = parentMenus;
      // console.log("This is in footer");
      // console.log(this.menus);
    });
  }
  // log(email) {
  //   console.log(email);
  // }
  submit(f) {
    // console.log(f);
    // let value = f.value
    // console.log("Submit click and value is", f.value);
    let email: string = f.value.email;

    this.subscriptionService
      .getByQueryParams(`email=${email}`)
      .subscribe(res => {
        this.isSubscribeClicked = true;
        f.resetForm();
        // console.log(res);

        let timeToSlide: number = 5000;
        setTimeout(() => {
          // console.log(`After ${timeToSlide} seconds...`);
          this.isSubscribeClicked = false;
        }, timeToSlide);
      });
  }
}
