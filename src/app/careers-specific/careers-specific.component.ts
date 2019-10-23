import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CareersService } from "../services/careers.service";
import { HttpClient } from "@angular/common/http";
import { Meta, Title } from "@angular/platform-browser";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-careers-specific",
  templateUrl: "./careers-specific.component.html",
  styleUrls: ["./careers-specific.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class CareersSpecificComponent implements OnInit {
  career: any = {};
  career_slug: string = "";
  fileToUpload: File = null;
  fileName: string = "";
  isAvailable: boolean;
  isFileSelected: boolean;

  constructor(
    private route: ActivatedRoute,
    private careersService: CareersService,
    private httpCLient: HttpClient,
    private meta: Meta,
    private titleSevice: Title
  ) {
    console.log(this.fileToUpload, "FileToUpload...");
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let careerSlug = params.get("specificCareer");
      careerSlug = "slug=" + careerSlug;

      this.careersService.getByQueryParams(careerSlug).subscribe((careerResponse: any[]) => {
        console.log("Careers Response...");
        console.log(careerResponse);

        let description = unescape(careerResponse[0].Description);
        this.career_slug = careerResponse[0].Slug;
        let careerObject = {
          title: careerResponse[0].JobTitle,
          position: careerResponse[0].NoOfPosition,
          cities: careerResponse[0].Cities,
          type: careerResponse[0].JobType,
          description: description,
          slug: careerResponse[0].Slug,
          metaDescription: careerResponse[0].MetaDescription,
          metaKeywords: careerResponse[0].MetaKeywords,
          pageTitle: careerResponse[0].PageTitle
        };

        this.career = careerObject;
        // console.log(this.career);

        this.titleSevice.setTitle(this.career.pageTitle);
        this.meta.updateTag({ name: "keywords", content: this.career.metaKeywords });
        this.meta.updateTag({ name: "description", content: this.career.metaDescription });

        this.isAvailable = true;
      });
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

    this.fileName = this.fileToUpload.name;
    console.log(this.fileName, "File to upload | Name ....");
  }

  save(f) {
    if (!this.fileToUpload) {
      this.fileName = "No File Selected";
      this.isFileSelected = true;
    } else {
      console.log(f);
      this.isFileSelected = false;

      const formData: FormData = new FormData();
      formData.append("", this.fileToUpload, this.fileToUpload.name);
      formData.append("Name", f.value.name);
      formData.append("Email", f.value.email);
      formData.append("PhoneNo", f.value.phone);
      formData.append("CoverLetter", f.value.coverLetter);
      formData.append("slug", this.career_slug);

      f.resetForm();
      this.fileName = "";

      console.log("Uploading form data ...");

      this.httpCLient
        .post("http://web.tmrc1.ga/api/submitapplication", formData)
        .subscribe(res => console.log(res));
    }
  }
}
