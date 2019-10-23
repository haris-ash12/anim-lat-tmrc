import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID
} from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, share } from "rxjs/operators";
import { MenuService } from "../services/menus/menu.service";
import { NewsService } from "../services/news.service";
import { Router, NavigationEnd } from "@angular/router";
import { MatSidenav } from "@angular/material";
import { ScrollDispatcher, CdkScrollable } from "@angular/cdk/scrolling";
import { isPlatformBrowser, ViewportScroller } from "@angular/common";
import { Meta, Title } from "@angular/platform-browser";

// const content = document.querySelector(".mat-sidenav-content");

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"]
})
export class MainNavComponent implements OnInit {
  // scrollingSubscription: any;
  // private onWindowScroll(data: CdkScrollable) {
  //   const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;

  //   console.log(scrollTop);
  // }
  @ViewChild("drawer", { static: false }) sidenav: MatSidenav;
  menusResponse: any[] = [];
  menus: any[] = [];
  news: any = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    share()
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private menuService: MenuService,
    private newsService: NewsService,
    private router: Router,
    public scroll: ScrollDispatcher,
    private meta: Meta,
    private titleSevice: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this.scrollingSubscription = this.scroll.scrolled().subscribe((data: CdkScrollable) => {
    //   this.onWindowScroll(data);
    // });

    console.log("Menus component .....................................................");

    this.router.events.subscribe(val => {
      let currentRoute = this.router.url;
      // console.log("current route ....");
      // console.log(currentRoute);

      let c = currentRoute.split("#");

      if (val instanceof NavigationEnd) {
        // Beacause we are injecting our router inside material side nav, scrollPositionRestoration to top doesnot works with routing array.
        // We need to set this using this method.
        if (c.length === 1) {
          if (isPlatformBrowser(this.platformId)) {
            document.getElementsByTagName("mat-sidenav-content")[0].scrollTo(0, 0);
          }
        } else {
          // if (isPlatformBrowser(this.platformId)) {
          //   document.getElementsByTagName("mat-sidenav-content")[0].scrollTop -= 75;
          // }
        }

        // FOR SEO PURPOSE
        this.addMetaTagsMatchingCurrentUrl(currentRoute);

        // console.log("navigation ends....");
        this.sidenav.close();
      }
    });
  }

  ngOnInit() {
    let parentMenus: any[] = [];

    // call menu service, getData and make logic.
    this.menuService.getAll().subscribe((menusResponse: any[]) => {
      console.log("menus Response ...");
      console.log(menusResponse);
      this.menusResponse = menusResponse;

      // FOR SEO PURPOSE
      let currentRoute = this.router.url;
      this.addMetaTagsMatchingCurrentUrl(currentRoute);

      for (let i = 0; i < menusResponse.length; i++) {
        if (menusResponse[i].ParentId === 0) {
          let parentMenuObject = {
            id: menusResponse[i].TitleId,
            titleName: menusResponse[i].TitleName,
            slug: menusResponse[i].Slug,
            priority: menusResponse[i].Priority,
            metaDescription: menusResponse[i].MetaDescription,
            metaKeywords: menusResponse[i].MetaKeywords,
            pageTitle: menusResponse[i].PageTitle
          };
          parentMenus.push(parentMenuObject);
        }
      }
      // console.log("Parent menus...");
      // console.log(parentMenus);

      // Log parent menu
      // console.log('Parent Menu ...');
      // console.log(parentMenus);

      for (let i = 0; i < parentMenus.length; i++) {
        let subMenus: any[] = [];
        for (let j = 0; j < menusResponse.length; j++) {
          if (parentMenus[i].id === menusResponse[j].ParentId) {
            // console.log(parentMenus[i].titleName + '......');

            let singleChildObject = {
              id: menusResponse[j].TitleId,
              titleName: menusResponse[j].TitleName,
              slug: menusResponse[j].Slug,
              priority: menusResponse[i].Priority,
              metaDescription: menusResponse[i].MetaDescription,
              metaKeywords: menusResponse[i].MetaKeywords,
              pageTitle: menusResponse[i].PageTitle
            };
            subMenus.push(singleChildObject);
          }
        }
        parentMenus[i]["children"] = subMenus;
      }

      this.menus = parentMenus;
      // console.log("List of menus array ...");
      // console.log(this.menus);

      // GET ALL NEWS
      //------------------------
      this.newsService.getAll().subscribe((newsResponse: any[]) => {
        // console.log(newsResponse);

        for (let i = 0; i < newsResponse.length; i++) {
          let newsObject = {
            title: newsResponse[i].Title,
            datePosted: newsResponse[i].CreatedDate,
            slug: newsResponse[i].Slug
          };
          this.news.push(newsObject);
        }
      });
      //------------------------
    });
  }

  addMetaTagsMatchingCurrentUrl(currentRoute) {
    // console.log("addMetaTagsMatchingCurrentUrl() ...");
    // console.log(currentRoute.split("/"));
    let currentRoutesArray = currentRoute.split("/");
    // console.log(this.menusResponse.length);

    for (let i = 0; i < this.menusResponse.length; i++) {
      let valueToMatch: string;
      if (currentRoutesArray.length === 2) {
        valueToMatch = currentRoutesArray[1];

        if (currentRoutesArray[1] === "") valueToMatch = "/";
      } else if (currentRoutesArray.length === 3) {
        valueToMatch = currentRoutesArray[2];
      }

      if (valueToMatch === this.menusResponse[i].Slug) {
        // console.log("Slug Matched ...");

        this.titleSevice.setTitle(this.menusResponse[i].PageTitle);
        this.meta.updateTag({ name: "keywords", content: this.menusResponse[i].MetaKeywords });
        this.meta.updateTag({
          name: "description",
          content: this.menusResponse[i].MetaDescription
        });

        // console.log("TItle", this.menusResponse[i].PageTitle);
        // console.log("Mete keywords", this.menusResponse[i].MetaKeywords);
        // console.log("Description", this.menusResponse[i].MetaDescription);
      }
    }
  }
}
