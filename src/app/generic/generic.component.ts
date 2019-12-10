import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SubmenuService } from "../services/menus/submenu.service";
import { GenericContentService } from "../services/generic-content.service";
import { DomSanitizer, SafeHtml, Meta, Title } from "@angular/platform-browser";
import { GlobalsService } from "../services/globals.service";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { HelperValuesService } from "../services/helper-values.service";

@Component({
  selector: "app-generic",
  templateUrl: "./generic.component.html",
  styleUrls: ["./generic.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class GenericComponent implements OnInit {
  sideContents: any = [];
  submenus: any[] = [];
  content: any = {};
  parentMenu: string = "";
  childMenu: string = "";
  isAvailable: boolean;
  isContentReady: boolean;

  constructor(
    private route: ActivatedRoute,
    private submenuService: SubmenuService,
    private genericContentService: GenericContentService,
    private meta: Meta,
    private titleSevice: Title,
    private _sanitizer: DomSanitizer,
    private globals: GlobalsService,
    public helperService: HelperValuesService
  ) {
    // console.log("Genric component .............................................");
    // console.log("Printing Meta tags for Generic component..., GO CHECK!");
    // this.meta.addTag({ name: "Generic", content: "the generic tag ...." });
    // this.titleSevice.setTitle("Setting a title...");
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let parentMenu = params.get("menu");
      let childMenu = params.get("submenu");

      // * --------------------------------------------------------------------------------------
      // * Now we have the parent menu, we need to call the api and get the list of its submenus.
      // * If parent menu is same as before[this.parentMenu], then no need to call the api to get submenus,
      // * because they are same.

      if (this.parentMenu !== parentMenu) {
        this.submenus = [];
        let parentQueryParam = "parent=" + parentMenu;
        this.submenuService
          .getByQueryParams(parentQueryParam)
          .subscribe((submenusResponse: any[]) => {
            // console.log("submenus...");
            // console.log(submenusResponse);

            for (let i = 0; i < submenusResponse.length; i++) {
              let submenuObject = {
                titleName: submenusResponse[i].TitleName,
                slug: submenusResponse[i].Slug
              };

              this.submenus.push(submenuObject);
            }
            // console.log(this.submenus);
          });
      }
      // * --------------------------------------------------------------------------------------------

      // Replace that hyphen with space.
      this.parentMenu = parentMenu.replace(/-/g, " ");
      this.childMenu = childMenu;

      // From the childmenu item, make api request to end point to get the content of specific child.
      // --------------------------------------------------------------------------------------------
      this.isContentReady = false;
      let childQueryParam = "url=" + childMenu;
      this.genericContentService
        .getByQueryParams(childQueryParam)
        .subscribe((contentResponse: any) => {
          this.isAvailable = true;
          this.isContentReady = true;

          this.sideContents = [];

          // console.log("Generic content Response ...");
          // console.log(contentResponse);

          // First we need to unescape details value.
          let details = unescape(contentResponse.Details);
          // console.log(details);
          // console.log('Full line above......................');

          let tagValueArray = [];
          let tagValueWithHyphenArray = [];

          // Remove <p></p> from <p><img ></p>, so that only <img > remains.
          details = details.replace(/<p><img(.*?)><\/p>/g, value => {
            let valueWithNoPtag = value.replace(/<\/?p>/g, "");
            let valueWithNoStyle = valueWithNoPtag.replace(
              /style="(.*?)"/g,
              ""
            );

            return valueWithNoStyle;
          });

          // Add id addtribute to h2 tags for scrolling.
          details = details.replace(/<h2>(.*?)<\/h2>/g, value => {
            let valueInTag = value.replace(/<\/?h2>/g, "");
            tagValueArray.push(valueInTag);

            let valueWithHyphens = valueInTag.replace(/ /g, "-");
            tagValueWithHyphenArray.push(valueWithHyphens);

            let newTag = '<h2 id="' + valueWithHyphens + '">';

            // let valueWithHyphens =
            //   '<h2 name="' + value.replace(/<\/?h2>/g, '').replace(/ /g, '-') + '">';
            // console.log('name="' + value.replace(/<\/?h2>/g, '').replace(/ /g, '-') + '"');

            let newValue = value.replace(/<h2>/, newTag);

            return newValue;
          });

          let sanitizedDetails: SafeHtml = this._sanitizer.bypassSecurityTrustHtml(
            details
          );
          // console.log("Details object....");
          // console.log(sanitizedDetails);
          // console.log(a1);
          // console.log(a2);

          for (let i = 0; i < tagValueArray.length; i++) {
            let contentObject = {
              title: tagValueArray[i],
              hrefValue: tagValueWithHyphenArray[i]
            };
            this.sideContents.push(contentObject);
          }

          // console.log("side contents..");
          // console.log(this.sideContents);
          // );

          // console.log(
          //   details.match(/<h2>(.*?)<\/h2>/g).map(value => {
          //     // console.log(value);

          //     return 'abc';
          //   })
          // );

          let contentObject = {
            details: sanitizedDetails,
            imageUrl: contentResponse.ImageUrl,
            imageAlt: contentResponse.ImageAlt,
            imageTitle: contentResponse.ImageTitle,
            pageTitle: contentResponse.PageTitle,
            slug: contentResponse.Slug,
            metaDescription: contentResponse.MetaDescription,
            metaKeywords: contentResponse.MetaKeywords,
            contentTitle: contentResponse.Title
          };

          this.content = contentObject;

          // console.log("Content Object ...");
          // console.log(this.content);

          this.titleSevice.setTitle(this.content.pageTitle);

          if (this.content.metaKeywords) {
            this.meta.updateTag({
              name: "keywords",
              content: this.content.metaKeywords
            });
          }
          if (this.content.metaDescription) {
            this.meta.updateTag({
              name: "description",
              content: this.content.metaDescription
            });
          }

          // this.meta.updateTag({ name: "keywords", content: this.content.metaKeywords });
          // this.meta.updateTag({ name: "description", content: this.content.metaDescription });
          // console.log(this.content);
        });
    });
  }
  // scrollToThisId(id: string) {
  //   // document.getElementsByTagName("mat-sidenav-content")[0].scrollTop -= 90;
  //   //document.getElementById(id).scrollTo(0, -300);
  //   //window.scrollTo(0, -10);
  // }

  // scrolli() {
  //   document.getElementById("abc-abc").scrollIntoView();
  // }
}
