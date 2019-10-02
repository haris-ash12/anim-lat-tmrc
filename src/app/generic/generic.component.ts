import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SubmenuService } from "../services/menus/submenu.service";
import { GenericContentService } from "../services/generic-content.service";
import { DomSanitizer, SafeHtml, Meta, Title } from "@angular/platform-browser";
import { GlobalsService } from "../services/globals.service";

@Component({
  selector: "app-generic",
  templateUrl: "./generic.component.html",
  styleUrls: ["./generic.component.scss"]
})
export class GenericComponent implements OnInit {
  sideContents: any = [];
  submenus: any[] = [];
  content: any = {};
  parentMenu: string = "";
  childMenu: string = "";

  constructor(
    private route: ActivatedRoute,
    private submenuService: SubmenuService,
    private genericContentService: GenericContentService,
    private meta: Meta,
    private titleSevice: Title,
    private _sanitizer: DomSanitizer,
    private globals: GlobalsService
  ) {
    console.log("Printing Meta tags for Generic component..., GO CHECK!");
    this.meta.addTag({ name: "Generic", content: "the generic tag ...." });
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
            console.log("submenus...");
            console.log(submenusResponse);
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

      this.parentMenu = parentMenu;
      this.childMenu = childMenu;

      // From the childmenu item, make api request to end point to get the content of specific child.
      // --------------------------------------------------------------------------------------------
      let childQueryParam = "url=" + childMenu;
      this.genericContentService
        .getByQueryParams(childQueryParam)
        .subscribe((contentResponse: any) => {
          this.sideContents = [];

          console.log("Content Response ...");
          console.log(contentResponse);

          // First we need to unescape details value.
          let details = unescape(contentResponse.Details);
          // console.log(details);
          // console.log('Full line above......................');

          let tagValueArray = [];
          let tagValueWithHyphenArray = [];

          // console.log(
          details = details.replace(/<h2>(.*?)<\/h2>/g, value => {
            // console.log('...................This one is regex');
            // console.log(value);

            let valueInTag = value.replace(/<\/?h2>/g, "");
            tagValueArray.push(valueInTag);

            let valueWithHyphens = valueInTag.replace(/ /g, "-");
            tagValueWithHyphenArray.push(valueWithHyphens);

            let newTag = '<h2 name="' + valueWithHyphens + '">';

            // let valueWithHyphens =
            //   '<h2 name="' + value.replace(/<\/?h2>/g, '').replace(/ /g, '-') + '">';
            // console.log('name="' + value.replace(/<\/?h2>/g, '').replace(/ /g, '-') + '"');

            let newValue = value.replace(/<h2>/, newTag);

            return newValue;
          });

          let sanitizedDetails: SafeHtml = this._sanitizer.bypassSecurityTrustHtml(details);
          // console.log(details);
          // console.log(a1);
          // console.log(a2);

          for (let i = 0; i < tagValueArray.length; i++) {
            let contentObject = {
              title: tagValueArray[i],
              hrefValue: tagValueWithHyphenArray[i]
            };
            this.sideContents.push(contentObject);
          }

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
            iconPath: this.globals.url + "/" + contentResponse.IconPath,
            pageTitle: contentResponse.PageTitle,
            slug: contentResponse.Slug,
            metaDescription: contentResponse.MetaDescription,
            metaKeywords: contentResponse.MetaKeywords,
            contentTitle: contentResponse.Title
          };

          this.content = contentObject;

          console.log("Content Object ...");
          console.log(this.content);

          this.titleSevice.setTitle(this.content.pageTitle);
          this.meta.updateTag({ name: "keywords", content: this.content.metaKeywords });
          this.meta.updateTag({ name: "description", content: this.content.metaDescription });
          // console.log(this.content);
        });
    });
  }
}
