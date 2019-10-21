import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { MenuService } from "./services/menus/menu.service";
import { LoaderService } from "./services/loader.service";
import { HelperValuesService } from "./services/helper-values.service";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  // menus: any[] = [];

  constructor() {}

  ngOnInit() {
    // let parentMenus: any[] = [];
    // // call menu service, getData and make logic.
    // this.menuService.getAll().subscribe((menus: any[]) => {
    //   for (let i = 0; i < menus.length; i++) {
    //     if (menus[i].ParentId === 0) {
    //       let parentMenuObject = {
    //         id: menus[i].TitleId,
    //         titleName: menus[i].TitleName,
    //         slug: menus[i].Slug,
    //         priority: menus[i].Priority
    //       };
    //       parentMenus.push(parentMenuObject);
    //     }
    //   }
    // Log parent menu
    // console.log('Parent Menu ...');
    // console.log(parentMenus);
    // for (let i = 0; i < parentMenus.length; i++) {
    //   let subMenus: any[] = [];
    //   for (let j = 0; j < menus.length; j++) {
    //     if (parentMenus[i].id === menus[j].ParentId) {
    //       // console.log(parentMenus[i].titleName + '......');
    //       let singleChildObject = {
    //         id: menus[j].TitleId,
    //         titleName: menus[j].TitleName,
    //         slug: menus[j].Slug
    //       };
    //       subMenus.push(singleChildObject);
    //       // console.log('...' + menus[j].TitleName);
    //     }
    //   }
    //   parentMenus[i]["children"] = subMenus;
    // }
    //   // console.log(parentMenus);
    //   this.menus = parentMenus;
    //   // console.log(this.menus);
    // });
  }
}
