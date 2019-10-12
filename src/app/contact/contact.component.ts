import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SubmenuService } from "../services/menus/submenu.service";
import { GenericContentService } from "../services/generic-content.service";
import { Meta, Title, DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { GlobalsService } from "../services/globals.service";
import { ContactUsService } from "../services/contact-us.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
  sideContents: any = [];
  submenus: any[] = [];
  content: any = {};
  parentMenu: string = "";
  childMenu: string = "";

  constructor(
    private router: Router,
    private submenuService: SubmenuService,
    private genericContentService: GenericContentService,
    private contactService: ContactUsService,
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
    let urlValue = this.router.url.split("/");
    let parentMenu = urlValue[1];
    let childMenu = urlValue[2];

    console.log(urlValue[2] + "..." + urlValue[1]);

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

    this.parentMenu = parentMenu;
    this.childMenu = childMenu;

    let childQueryParam = "url=" + childMenu;
    this.genericContentService
      .getByQueryParams(childQueryParam)
      .subscribe((contentResponse: any) => {
        this.sideContents = [];

        console.log("Content Response ...");
        console.log(contentResponse);

        // First we need to unescape details value.
        let details = unescape(contentResponse.Details);

        let contentObject = {
          details: details,
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
  }
  // scrollToThisId(id: string) {}

  submit(f) {
    console.log(f.value);

    // Send form data to server.
    const formData = new FormData();
    formData.append("Name", f.value.name);
    formData.append("Email", f.value.email);
    formData.append("Subject", f.value.subject);
    formData.append("Message", f.value.message);

    this.contactService.create(formData).subscribe(res => console.log(res));
  }
}
