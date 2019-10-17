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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this.scrollingSubscription = this.scroll.scrolled().subscribe((data: CdkScrollable) => {
    //   this.onWindowScroll(data);
    // });

    this.router.events.subscribe(val => {
      let c = this.router.url.split("#");

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

        // console.log("navigation ends....");
        this.sidenav.close();
      }
    });
  }

  ngOnInit() {
    let parentMenus: any[] = [];

    // call menu service, getData and make logic.
    this.menuService.getAll().subscribe((menus: any[]) => {
      // console.log("menus...");
      // console.log(menus);

      for (let i = 0; i < menus.length; i++) {
        if (menus[i].ParentId === 0) {
          let parentMenuObject = {
            id: menus[i].TitleId,
            titleName: menus[i].TitleName,
            slug: menus[i].Slug,
            priority: menus[i].Priority,
            metaDescription: menus[i].MetaDescription,
            metaKeywords: menus[i].MetaKeywords,
            pageTitle: menus[i].PageTitle
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
        for (let j = 0; j < menus.length; j++) {
          if (parentMenus[i].id === menus[j].ParentId) {
            // console.log(parentMenus[i].titleName + '......');

            let singleChildObject = {
              id: menus[j].TitleId,
              titleName: menus[j].TitleName,
              slug: menus[j].Slug
            };
            subMenus.push(singleChildObject);

            // console.log('...' + menus[j].TitleName);
          }
        }
        parentMenus[i]["children"] = subMenus;
      }

      // console.log(parentMenus);
      this.menus = parentMenus;
      // console.log(this.menus);

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
}
