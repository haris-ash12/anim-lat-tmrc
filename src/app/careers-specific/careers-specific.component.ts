import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CareersService } from "../services/careers.service";
import { HttpClient } from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { StartUpService } from "../services/start-up.service";
import { SubmitResumeService } from "../services/submit-resume.service";
import { HelperValuesService } from "../services/helper-values.service";

@Component({
  selector: "app-careers-specific",
  templateUrl: "./careers-specific.component.html",
  styleUrls: ["./careers-specific.component.scss"],
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
    ]),
    trigger("slideInToOut", [
      state(
        "out",
        style({ opacity: 0, transform: "translateX(-100px)", "z-index": -1 })
      ),
      state("in", style({ opacity: 1, transform: "translateX(0px)" })),

      transition("out => in", animate("500ms ease")),
      transition(
        "in => out",
        animate(
          "500ms ease",
          style({ opacity: 0, transform: "translateX(100px)" })
        )
      )
    ])
  ]
})
export class CareersSpecificComponent implements OnInit {
  career: any = {};
  careerSlug: string = "";
  fileToUpload: File = null;
  fileName: string = "";
  isAvailable: boolean;
  isFileSelected: boolean;
  docFile =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  pdfFile = "application/pdf";
  isSaveClicked: boolean;
  isLargeFile: boolean;
  isFormatAllowed: boolean;
  isResponseValid: boolean;
  isUploadFailed: boolean;
  isFailed: boolean;
  isExpired: boolean;

  constructor(
    private route: ActivatedRoute,
    private careersService: CareersService,
    private startupService: StartUpService,
    private submitResumeService: SubmitResumeService,
    private httpCLient: HttpClient,
    private meta: Meta,
    private titleSevice: Title,
    public helperService: HelperValuesService
  ) {
    // console.log(this.fileToUpload, "FileToUpload...");
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let careerSlug = params.get("specificCareer");
      careerSlug = "slug=" + careerSlug;

      this.careersService
        .getByQueryParams(careerSlug)
        .subscribe((careerResponse: any[]) => {
          // console.log("Careers Response...");
          // console.log(careerResponse);

          let description = unescape(careerResponse[0].Description);

          // Remove <p></p> from <p><img ></p>, so that only <img > remains.
          description = description.replace(/<p><img(.*?)><\/p>/g, value => {
            let valueWithNoPtag = value.replace(/<\/?p>/g, "");
            let valueWithNoStyle = valueWithNoPtag.replace(
              /style="(.*?)"/g,
              ""
            );

            return valueWithNoStyle;
          });

          this.careerSlug = careerResponse[0].Slug;
          let careerObject = {
            title: careerResponse[0].JobTitle,
            position: careerResponse[0].NoOfPosition,
            cities: careerResponse[0].Cities,
            type: careerResponse[0].JobType,
            description: description,
            maxSalary: careerResponse[0].MaxCostOfHiring,
            minSalary: careerResponse[0].MinCostOfHiring,
            isShowSalary: careerResponse[0].IsShowCostOfHiring,
            dueDate: careerResponse[0].ExpiryDate,
            slug: careerResponse[0].Slug,
            metaDescription: careerResponse[0].MetaDescription,
            metaKeywords: careerResponse[0].MetaKeywords,
            pageTitle: careerResponse[0].PageTitle
          };

          // console.log("Careers response after change ...");
          this.career = careerObject;
          // console.log(this.career);

          // console.log("this.career.dueDate", new Date(this.career.dueDate));
          // console.log("Date.now()", new Date(Date.now()));

          if (new Date(Date.now()) > new Date(this.career.dueDate)) {
            // console.log("Due date gone...");
            this.isExpired = true;
          } else {
            // console.log("Due date not gone...");
          }

          this.titleSevice.setTitle(this.career.pageTitle);

          if (this.career.metaKeywords) {
            this.meta.updateTag({
              name: "keywords",
              content: this.career.metaKeywords
            });
          }

          if (this.career.metaDescription) {
            this.meta.updateTag({
              name: "description",
              content: this.career.metaDescription
            });
          }

          // this.meta.updateTag({
          //   name: "keywords",
          //   content: this.career.metaKeywords
          // });
          // this.meta.updateTag({
          //   name: "description",
          //   content: this.career.metaDescription
          // });

          this.isAvailable = true;
        });
    });
  }

  handleFileInput(files: FileList) {
    // console.log(files);

    this.fileToUpload = files.item(0);

    // console.log(this.fileToUpload);

    this.fileName = this.fileToUpload.name;
    // console.log(this.fileName, "File to upload | Name ....");
    this.isFileSelected = false;
  }

  save(f) {
    if (!this.fileToUpload) {
      this.fileName = "No File Selected";
      this.isFileSelected = true;
    } else if (
      this.fileToUpload.type !== this.docFile &&
      this.fileToUpload.type !== this.pdfFile
    ) {
      // console.log("this.fileToUpload.type", this.fileToUpload.type);
      // console.log("this.docFile", this.docFile);
      // console.log("this.pdfFile", this.pdfFile);

      this.fileName = "File not allowed";
      this.isFileSelected = true;
    } else {
      // console.log(f);

      const formData: FormData = new FormData();
      formData.append("", this.fileToUpload, this.fileToUpload.name);
      formData.append("Name", f.value.name);
      formData.append("Email", f.value.email);
      formData.append("PhoneNo", f.value.phone);
      formData.append("CoverLetter", f.value.coverLetter);
      formData.append("slug", this.careerSlug);

      // ! Hardcoded value of country code, need to change that later.
      // * Country code changed now, but needs to be checked.
      formData.append("CountryCode", this.startupService.getCountryCode);

      // console.log("Uploading form data ...");
      this.isSaveClicked = true;

      this.httpCLient
        .post(
          "http://52.155.227.188/admin/api/submitapplication",
          formData
        )
        // this.submitResumeService.create(formData)
        .subscribe(submitResponse => {
          // console.log("This is the response from server while uploadin ..");
          // console.log(submitResponse);
          // submitResponse = 1;

          // submitResponse = 1;

          // if (submitResponse) {
          //   setTimeout(() => {
          //     this.isResponseValid = true;
          //     this.isSaveClicked = false;

          //     f.resetForm();
          //     this.fileName = "";
          //   }, 1500);
          // }

          // setTimeout(() => {
          //   this.isResponseValid = false;
          // }, 5000);

          // We get the response in the form of flags.
          // 1 - File size greater then 5MB not allowed.
          // 2 - Only pdf and doc file fomrat allowed.
          // 3 - File uploaded successfully.
          // 4 - Upload failed.
          // 5 - Failed

          if (submitResponse) {
            setTimeout(() => {
              this.isSaveClicked = false;

              if (submitResponse === 1) {
                this.isLargeFile = true;
              } else if (submitResponse === 2) {
                this.isFormatAllowed = true;
              } else if (submitResponse === 3) {
                this.isResponseValid = true;

                f.resetForm();
                this.fileName = "";
              } else if (submitResponse === 4) {
                this.isUploadFailed = true;
              } else if (submitResponse === 5) {
                this.isFailed = true;
              }
            }, 500);
          }

          setTimeout(() => {
            this.isLargeFile = false;
            this.isFormatAllowed = false;
            this.isResponseValid = false;
            this.isUploadFailed = false;
            this.isFailed = false;
          }, 5000);
        });
    }

    // --------------------------------- SAVE CLICKED
    // console.log("Save clicked ");

    // this.isSaveClicked = true;
  }
}
