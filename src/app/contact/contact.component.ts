import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SubmenuService } from "../services/menus/submenu.service";
import { GenericContentService } from "../services/generic-content.service";
import { Meta, Title, DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { GlobalsService } from "../services/globals.service";
import { ContactUsService } from "../services/contact-us.service";
import { ContactAddressService } from "../contact-address.service";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { HelperValuesService } from "../services/helper-values.service";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ]),
    trigger("fadeInToOut", [
      state("out", style({ opacity: 0, "z-index": "-1" })),
      state("in", style({ opacity: 1, "z-index": "1" })),
      transition("out => in", animate("500ms ease")),
      transition("in => out", animate("1000ms ease"))
    ])
  ]
})
export class ContactComponent implements OnInit {
  sideContents: any = [];
  submenus: any[] = [];
  content: any = {};
  contactAddresses: any[] = [];
  parentMenu: string = "";
  childMenu: string = "";
  isAvailable: boolean;
  isSaveClicked: boolean;
  isResponseValid: boolean;
  isResponseNotValid: boolean;

  constructor(
    private router: Router,
    private submenuService: SubmenuService,
    private genericContentService: GenericContentService,
    private contactService: ContactUsService,
    private contactAddressService: ContactAddressService,
    private meta: Meta,
    private titleSevice: Title,
    private _sanitizer: DomSanitizer,
    private globals: GlobalsService,
    public helperService: HelperValuesService
  ) {
    // console.log("Contact component ................................................. ");
    // console.log("Printing Meta tags for Generic component..., GO CHECK!");
    this.meta.addTag({ name: "Generic", content: "the generic tag ...." });
    // this.titleSevice.setTitle("Setting a title...");
  }

  ngOnInit() {
    let urlValue = this.router.url.split("/");
    let parentMenu = urlValue[1];
    let childMenu = urlValue[2];

    // console.log(urlValue[2] + "..." + urlValue[1]);

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

    this.parentMenu = parentMenu;
    this.childMenu = childMenu;

    let childQueryParam = "url=" + childMenu;
    this.genericContentService
      .getByQueryParams(childQueryParam)
      .subscribe((contentResponse: any) => {
        this.sideContents = [];

        // console.log("Content Response ...");
        // console.log(contentResponse);

        // First we need to unescape details value.
        let details = unescape(contentResponse.Details);

        let contentObject = {
          details: details,
          imageUrl: contentResponse.ImageUrl,
          imageTitle: contentResponse.ImageTitle,
          imageAlt: contentResponse.imageAlt,
          pageTitle: contentResponse.PageTitle,
          slug: contentResponse.Slug,
          metaDescription: contentResponse.MetaDescription,
          metaKeywords: contentResponse.MetaKeywords,
          contentTitle: contentResponse.Title
        };

        this.content = contentObject;

        // console.log("Content Object ...");
        // console.log(this.content);

        // Get contact addresses from API
        this.contactAddressService.getAll().subscribe((contactAddressesResponse: any[]) => {
          // console.log("Contact addressess ....");
          // console.log(contactAddressesResponse);

          for (let i = 0; i < contactAddressesResponse.length; i++) {
            let contactAddressObject = {
              title: contactAddressesResponse[i].Title,
              address: contactAddressesResponse[i].Address,
              telephone: contactAddressesResponse[i].PhoneNumber,
              fax: contactAddressesResponse[i].Fax,
              locationLink: contactAddressesResponse[i].LocationLink,
              imageUrl: contactAddressesResponse[i].ImageUrl,
              imageAlt: contactAddressesResponse[i].ImageAlt,
              imageTitle: contactAddressesResponse[i].imageTitle
            };

            this.contactAddresses.push(contactAddressObject);
          }

          // console.log("Modified contact addresses object ...");
          // console.log(this.contactAddresses);

          this.isAvailable = true;
        });

        this.titleSevice.setTitle(this.content.pageTitle);
        this.meta.updateTag({ name: "keywords", content: this.content.metaKeywords });
        this.meta.updateTag({ name: "description", content: this.content.metaDescription });
        // console.log(this.content);
      });
  }
  // scrollToThisId(id: string) {}

  submit(f) {
    // console.log(f.value);

    // Send form data to server.
    const formData = new FormData();
    formData.append("Name", f.value.name);
    formData.append("Email", f.value.email);
    formData.append("Subject", f.value.subject);
    formData.append("Message", f.value.message);

    this.isSaveClicked = true;

    this.contactService.create(formData).subscribe(contactResponse => {
      // console.log(contactResponse);
      // contactResponse = 2;
      // this.isSaveClicked = false;
      // this.isResponseValid = true;
      // setTimeout(() => {
      //   f.resetForm();
      //   this.isResponseValid = false;
      // }, 3000);

      // Contact resposne
      // 1- Successfully submitted.
      // 2- Error occured.

      if (contactResponse) {
        this.isSaveClicked = false;

        if (contactResponse === 1) {
          this.isResponseValid = true;
          f.resetForm();
        } else if (contactResponse === 2) {
          this.isResponseNotValid = true;
        }

        setTimeout(() => {
          this.isResponseValid = false;
          this.isResponseNotValid = false;
        }, 4000);
      }
    });
  }
}
