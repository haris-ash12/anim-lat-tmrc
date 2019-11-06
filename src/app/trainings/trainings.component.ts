import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { TrainingsCategoryService } from "../trainings-category.service";
import { TrainingsService } from "../trainings.service";
import { HelperValuesService } from "../services/helper-values.service";
import { isPlatformBrowser } from "@angular/common";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-trainings",
  templateUrl: "./trainings.component.html",
  styleUrls: ["./trainings.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class TrainingsComponent implements OnInit {
  trainingCategoriesList: any[] = [];
  trainingsResponse: any[] = [];
  trainingsList: any[] = [];

  query: string;
  trainingCategoryId: number;
  parentId: number;
  childId: number;
  tags: string;
  pageno: number;
  total: number;

  isAvailable: boolean;

  constructor(
    private trainingsCategoryService: TrainingsCategoryService,
    private trainingsService: TrainingsService,
    public helperService: HelperValuesService,
    private _sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // console.log("Trainings Component ......................................");

    // These would be our initial values for the query.
    this.trainingCategoryId = 0;
    this.tags = "";
    this.pageno = 1;
    this.parentId = 0;
    this.childId = 0;

    // Check values if it is navigating back from blog details.
    if (this.helperService.trainingCategoryParentId)
      this.parentId = this.helperService.trainingCategoryParentId;
    else if (this.helperService.trainingCategoryChildId)
      this.childId = this.helperService.trainingCategoryChildId;

    // Make a joint query.
    this.query =
      "pageno=" + this.pageno + "&parentId=" + this.parentId + "&childId=" + this.childId;
  }

  ngOnInit() {
    // Get Trainings Category List
    this.trainingsCategoryService.getAll().subscribe((trainingsCategoryResponse: any[]) => {
      // console.log("Trainnigs category response...");
      // console.log(trainingsCategoryResponse);

      for (let i = 0; i < trainingsCategoryResponse.length; i++) {
        let trainingCategoryObject = {
          title: trainingsCategoryResponse[i].TitleName,
          parentId: trainingsCategoryResponse[i].ParentId,
          childId: trainingsCategoryResponse[i].ChildId
        };

        this.trainingCategoriesList.push(trainingCategoryObject);
      }

      // console.log("Training categories List ...");
      // console.log(this.trainingCategoriesList);
    });

    // Get Trainings List
    this.trainingsService.getByQueryParams(this.query).subscribe((trainingsResponse: any) => {
      // console.log("Trainings Response .....");
      // console.log(trainingsResponse);

      this.total = trainingsResponse.Total;
      this.trainingsResponse = trainingsResponse.linksSeo;

      // console.log(this.total);
      // console.log(this.trainingsResponse);

      this.trainingsList = this.makeTrainingsObjectArray(trainingsResponse.linksSeo);
      // console.log("this.trainingsList Yani response ...");
      // console.log(this.trainingsList);

      this.isAvailable = true;
    });
  }
  categoryClicked(parentCategoryId, childCategoryId) {
    this.parentId = parentCategoryId;
    this.childId = childCategoryId;

    this.remakeQuery();
    // console.log(this.query);
    this.trainingsService.getByQueryParams(this.query).subscribe((trainingsResponse: any) => {
      // console.log(trainingsResponse);
      this.trainingsResponse = trainingsResponse.linksSeo;
      this.total = trainingsResponse.Total;
      this.trainingsList = this.makeTrainingsObjectArray(trainingsResponse.linksSeo);
      // console.log("Products clicked.....");
      // console.log(this.trainingsList);

      this.goToTop();
    });
  }

  makeTrainingsObjectArray(trainings: any[]) {
    let trainingsList: any = [];

    for (let i = 0; i < trainings.length; i++) {
      // Get description.
      // Unescape it.
      let description = unescape(trainings[i].ExternalLinks.Description);

      // Find the first p tag and find data b/w this p.
      // Limit this to 100 word or 150 may be.

      description = this.findTextInTagAndLimit(description);

      // let description = trainings[i].ExternalLinks.Description;

      let isRedirectionActive: boolean;
      if (!trainings[i].SEO.RedirectionUrl || !trainings[i].SEO.RedirectionType) {
        isRedirectionActive = false;
      } else {
        isRedirectionActive = true;
      }

      let blogsObject = {
        title: trainings[i].ExternalLinks.Title,
        date: trainings[i].ExternalLinks.CreateDate,
        description: description,
        videoUrl: this._sanitizer.bypassSecurityTrustResourceUrl(
          trainings[i].ExternalLinks.VideoUrl
        ),
        parentId: trainings[i].ExternalLinks.ParentId,
        childId: trainings[i].ExternalLinks.ChildId,
        slug: trainings[i].SEO.Slug,
        pageTitle: trainings[i].SEO.PageTitle,
        pageHeading: trainings[i].SEO.PageHeading,
        redirectionUrl: trainings[i].SEO.RedirectionUrl,
        redirectionType: trainings[i].SEO.RedirectionType,
        isRedirectionActive: isRedirectionActive
      };
      trainingsList.push(blogsObject);
    }
    return trainingsList;
  }

  findTextInTagAndLimit(description) {
    description.match(/<p>(.*?)<\/p>/).map(value => {
      description = value;
    });
    return description.substr(0, 120) + " ... ";
  }

  changePage(pageNumber) {
    this.pageno = pageNumber;
    this.remakeQuery();
    this.trainingsService.getByQueryParams(this.query).subscribe((trainingsResponse: any) => {
      this.trainingsResponse = trainingsResponse.blogs;
      this.total = trainingsResponse.Total;
      this.trainingsList = this.makeTrainingsObjectArray(trainingsResponse.blogs);
      // console.log(this.blogsList);

      this.goToTop();
    });
  }

  remakeQuery() {
    // Make a joint query.
    this.query =
      "pageno=" + this.pageno + "&parentId=" + this.parentId + "&childId=" + this.childId;
    // console.log(this.query);
  }

  goToTop() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName("mat-sidenav-content")[0].scrollTo(0, 0);
    }
  }
}
