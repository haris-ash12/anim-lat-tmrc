import { Component, OnInit } from "@angular/core";
import { TrainingsCategoryService } from "../trainings-category.service";
import { TrainingsService } from "../trainings.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, Meta, Title } from "@angular/platform-browser";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { HelperValuesService } from "../services/helper-values.service";

@Component({
  selector: "app-training-detail",
  templateUrl: "./training-detail.component.html",
  styleUrls: ["./training-detail.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class TrainingDetailComponent implements OnInit {
  trainingCategoriesList: any[] = [];
  training: any = {};
  isAvailable: boolean;

  constructor(
    private trainingsCategoryService: TrainingsCategoryService,
    private trainingsService: TrainingsService,
    private route: ActivatedRoute,
    private router: Router,
    public helperService: HelperValuesService,
    private meta: Meta,
    private titleService: Title,
    private _sanitizer: DomSanitizer
  ) {}

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

    let slugValue = this.route.snapshot.paramMap.get("slug");
    let slug = "slug=" + slugValue;

    this.trainingsService.getByQueryParams(slug).subscribe((trainingResponseArray: any[]) => {
      // console.log(trainingResponseArray[0]);

      let trainingResponse = trainingResponseArray[0];

      let description = unescape(trainingResponse.Description);

      // Remove <p></p> from <p><img ></p>, so that only <img > remains.
      description = description.replace(/<p><img(.*?)><\/p>/g, value => {
        let valueWithNoPtag = value.replace(/<\/?p>/g, "");
        let valueWithNoStyle = valueWithNoPtag.replace(/style="(.*?)"/g, "");

        return valueWithNoStyle;
      });

      this.training = {
        title: trainingResponse.Title,
        description: description,
        datePosted: trainingResponse.CreateDate,
        category: trainingResponse.CateGoryName,

        slug: trainingResponse.SEOSlug,

        metaDescription: trainingResponse.SEOMetaDescription,
        metaKeywords: trainingResponse.SEOMetaKeywords,

        pageTitle: trainingResponse.SEOPageTitle,
        pageHeading: trainingResponse.SEOPageHeading,
        videoUrl: this._sanitizer.bypassSecurityTrustResourceUrl(trainingResponse.VideoUrl)
      };
      // console.log(description);

      this.titleService.setTitle(this.training.pageTitle);
      this.meta.updateTag({ name: "keywords", content: this.training.metaKeywords });
      this.meta.updateTag({ name: "description", content: this.training.metaDescription });

      this.isAvailable = true;
    });
  }
  categoryClicked(parentId, childId) {
    this.helperService.trainingCategoryParentId = parentId;
    this.helperService.trainingCategoryChildId = childId;
    this.router.navigate([this.helperService.countryCodeHelperValue, "trainings"]);
  }
}
