import { Component, OnInit, HostListener, Inject, ViewChild, ElementRef } from "@angular/core";
import { HomeContentService } from "../services/home-content.service";
import { GlobalsService } from "../services/globals.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";
import { Meta } from "@angular/platform-browser";
import {
  trigger,
  transition,
  style,
  animate,
  state,
  keyframes,
  group,
  query,
  stagger
} from "@angular/animations";
import { HelperValuesService } from "../services/helper-values.service";

// declare const window: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [
    trigger("heroAnimations", [
      transition(":enter", [
        group([
          query(".hero-transition", [
            style({ opacity: 0 }),
            stagger("250ms", [
              style({ transform: "translateX(-20px)", opacity: 0 }),
              animate("1000ms ease", style({ transform: "translateX(0px)", opacity: 1 }))
            ])
          ]),
          query(".hero__btn-container", [
            style({ transform: "translateY(30px)", opacity: 0 }),
            animate("500ms 750ms ease-out", style({ transform: "translateY(0px)", opacity: 1 }))
          ])
        ])
      ])
    ]),
    trigger("fadeInRight", [
      state("out", style({ opacity: 0, transform: "translateX(100px)" })),
      state("in", style({ opacity: 1, transform: "translateX(0px)" })),
      transition("out => in", animate("500ms"))
    ]),
    trigger("fadeInLeft", [
      state("out", style({ opacity: 0, transform: "translateX(-100px)" })),
      state("in", style({ opacity: 1, transform: "translateX(0px)" })),
      transition("out => in", animate("500ms"))
    ]),
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
// [
//   style({ opacity: 0, transform: "translateX(-20px)" }),
//   animate(".5s ease-out", style({ opacity: 1, transform: "translateX(0px)" }))
// ]
export class HomeComponent implements OnInit {
  imageUrlArray: any[] = [];
  whoWeAre: any = {};
  ourServices: any[] = [];

  arrowSize: string = "10px";
  showArrows: boolean = true;
  showDots: boolean = true;
  dotColor: string = "#FFF";
  autoPlay: boolean = true;
  autoPlayInterval: number = 5000;
  height: string = "100%";
  state: string = "hide";
  scrollingSubscription: any;
  isAvailable: boolean;

  constructor(
    private homeService: HomeContentService,
    public helperService: HelperValuesService,
    private _sanitizer: DomSanitizer,
    public scroll: ScrollDispatcher
  ) {
    // console.log("Home component ..............................................................");

    this.scrollingSubscription = this.scroll.scrolled().subscribe((data: CdkScrollable) => {
      this.onWindowScroll(data);
    });

    // this.meta.addTag({ name: "name", content: "the tag ...." });
    // this.meta.addTag({ name: "naanotherme", content: "the another tag ...." });
  }

  ngOnInit() {
    this.homeService.getAll().subscribe((homeResponse: any) => {
      this.isAvailable = true;
      // console.log("Home response ...");
      // console.log(homeResponse);

      // Image Slider Model
      let sliderArrayResponse: any[] = homeResponse.ImageSliderModel;
      let WhoWeAreObjectResponse: any = homeResponse.WhoWeAreModel;
      let servicesResponse: any[] = homeResponse.OurServices;
      // console.log("Our Services ....");
      // console.log(servicesResponse);

      let sliderArray: any[] = [];

      for (let i = 0; i < sliderArrayResponse.length; i++) {
        let sliderObject = { url: sliderArrayResponse[i].ImageUrl };
        sliderArray.push(sliderObject);
      }
      this.imageUrlArray = sliderArray;
      // console.log(sliderArray);

      // console.log(WhoWeAreObjectResponse);
      this.whoWeAre["textContent"] = WhoWeAreObjectResponse.ContentDetails;
      this.whoWeAre["videoLink"] = this._sanitizer.bypassSecurityTrustResourceUrl(
        WhoWeAreObjectResponse.VedioUrl
      );

      for (let i = 0; i < servicesResponse.length; i++) {
        let url: string = servicesResponse[i].Url;
        let parent = url.split("/")[1];
        let child = url.split("/")[2];

        let serviceObject = {
          title: servicesResponse[i].Heading,
          description: servicesResponse[i].ContentDetails,
          imageUrl: servicesResponse[i].ImageUrl,
          imageTitle: servicesResponse[i].ImageTitle,
          imageAlt: servicesResponse[i].ImageAlt,
          url: {
            parent: parent,
            child: child
          }
        };
        this.ourServices.push(serviceObject);
      }
      // console.log("Our services at home !!!");
      // console.log(this.ourServices);
      // console.log("Who we are !!!");
      // console.log(this.whoWeAre);
    });
  }

  isFirst: boolean;
  private onWindowScroll(data: CdkScrollable) {
    this.isFirst = false;
    const scrollValue = data.getElementRef().nativeElement.scrollTop || 0;

    if (scrollValue > 150) {
      // console.log(scrollValue);
      this.isFirst = true;
      // console.log("isText ..." + this.isFirst);
    }
  }
}
