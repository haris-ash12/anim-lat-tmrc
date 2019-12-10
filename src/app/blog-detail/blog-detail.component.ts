import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { HelperValuesService } from "../services/helper-values.service";
import { BlogBySlugService } from "../services/blog-by-slug.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import { GlobalsService } from "../services/globals.service";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-blog-detail",
  templateUrl: "./blog-detail.component.html",
  styleUrls: ["./blog-detail.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class BlogDetailComponent implements OnInit {
  yearsList: any[] = [];
  productsList: any[] = [];
  blog: any = {};
  isAvailable: boolean;

  constructor(
    private productsService: ProductsService,
    private blogSlugService: BlogBySlugService,
    private route: ActivatedRoute,
    private router: Router,
    public helperService: HelperValuesService,
    private globals: GlobalsService,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit() {
    // --- YEARS ---
    // Create constructor function for years list.
    function Years() {
      let startYear = 2017;
      let currentYear = new Date().getFullYear();
      this.list = [2017];

      let loopCount = currentYear - startYear;

      for (let i = 0; i < loopCount; i++) {
        startYear = startYear + 1;
        this.list.push(startYear);
      }
    }

    const years = new Years();
    // Get list and display them in reverse order.
    this.yearsList = years.list.reverse();

    // --- PRODUCTS ---
    this.productsService.getAll().subscribe((productsResponse: any[]) => {
      for (let i = 0; i < productsResponse.length; i++) {
        let productObject = {
          title: productsResponse[i].CatName,
          id: productsResponse[i].Id
        };
        this.productsList.push(productObject);
      }
    });

    let slugValue = this.route.snapshot.paramMap.get("slug");
    let slug = "slug=" + slugValue;
    this.blogSlugService.getByQueryParams(slug).subscribe((blogResponse: any) => {
      // console.log("Specific Blog Response...");
      // console.log(blogResponse);

      let description = unescape(blogResponse.Description);

      // Remove <p></p> from <p><img ></p>, so that only <img > remains.
      description = description.replace(/<p><img(.*?)><\/p>/g, value => {
        let valueWithNoPtag = value.replace(/<\/?p>/g, "");
        let valueWithNoStyle = valueWithNoPtag.replace(/style="(.*?)"/g, "");

        return valueWithNoStyle;
      });

      this.blog = {
        title: blogResponse.Title,
        description: description,
        datePosted: blogResponse.CreatedDate,
        featureImage: this.globals.url + "/" + blogResponse.FeatureImage,
        slug: blogResponse.slug,
        productCategory: blogResponse.CatName,
        metaDescription: blogResponse.MetaDescription,
        metaKeywords: blogResponse.MetaKeywords,
        // This needs to be chnaged / Temporary Solution
        pageTitle: blogResponse.Title
      };
      // console.log(description);

      if (this.blog.metaKeywords) {
        this.meta.updateTag({
          name: "keywords",
          content: this.blog.metaKeywords
        });
      }

      if (this.blog.metaDescription) {
        this.meta.updateTag({
          name: "description",
          content: this.blog.metaDescription
        });
      }

      // console.log("Print metA keywords ....");
      // console.log(this.blog.metaKeywords);

      this.titleService.setTitle(this.blog.pageTitle);

      // this.meta.updateTag({
      //   name: "keywords",
      //   content: this.blog.metaKeywords
      // });
      // this.meta.updateTag({
      //   name: "description",
      //   content: this.blog.metaDescription
      // });

      this.isAvailable = true;
    });
  }

  productClicked(productId) {
    this.helperService.productId = productId;
    this.router.navigate([this.helperService.countryCodeHelperValue, "blog"]);
  }

  yearsClicked(year) {
    this.helperService.yearId = year;
    this.router.navigate([this.helperService.countryCodeHelperValue, "blog"]);
  }
}
