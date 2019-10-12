import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BlogsService } from "../services/blogs.service";
import { ProductsService } from "../services/products.service";
import { HelperValuesService } from "../services/helper-values.service";
import { Router } from "@angular/router";
import { GlobalsService } from "../services/globals.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-blogs",
  templateUrl: "./blogs.component.html",
  styleUrls: ["./blogs.component.scss"]
})
export class BlogsComponent implements OnInit {
  private blogsResponse: any[] = [];
  blogsList: any[] = [];
  productsList: any[] = [];
  yearsList: any[] = [];

  query: string;
  yearId: number;
  catid: number;
  tags: string;
  pageno: number;
  total: number;

  constructor(
    private blogsService: BlogsService,
    private productsService: ProductsService,
    private helperService: HelperValuesService,
    private globals: GlobalsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log("Blog components ........................................................");

    this.yearId = 2019;
    this.catid = 0;
    this.tags = "";
    this.pageno = 1;

    // Check values if it is navigating back from blog details.
    if (this.helperService.productId) this.catid = this.helperService.productId;
    else if (this.helperService.yearId) this.yearId = this.helperService.yearId;

    // Make a joint query.
    this.query = "year=" + this.yearId + "&catid=" + this.catid + "&pageno=" + this.pageno;
  }

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

    // --- BLOGS ---
    this.blogsService.getByQueryParams(this.query).subscribe((blogResponse: any) => {
      // BlogsResposne is an object with two properties, total and blogs Array..
      // And we need blogs array, blogs property.

      this.blogsResponse = blogResponse.blogs;
      // console.log(this.blogsResponse);

      this.total = blogResponse.Total;

      this.blogsList = this.makeBlogsObjectsArray(blogResponse.blogs);
      // console.log("Blogs list .....................................");
      // console.log(this.blogsList);

      // let blogsResponseArray = blogResponse.blogs;

      // for (let i = 0; i < blogsResponseArray.length; i++) {
      //   // Get description.
      //   // Unescape it.
      //   let description = unescape(blogsResponseArray[i].Description);
      //   // Find the first p tag and find data b/w this p.
      //   // Limit this to 100 word or 150 may be.
      //   // console.log(blogsResponseArray[i].Title);
      //   description = this.findTextInTagAndLimit(description);
      //   // console.log(description);

      //   let blogsObject = {
      //     date: blogsResponseArray[i].CreatedDate,
      //     description: description,
      //     featureImage: blogsResponseArray[i].FeatureImage,
      //     slug: blogsResponseArray[i].Slug,
      //     title: blogsResponseArray[i].Title
      //   };
      //   this.blogsList.push(blogsObject);
      // }
    });
  }

  makeBlogsObjectsArray(blogs: any[]) {
    let blogsList: any[] = [];
    for (let i = 0; i < blogs.length; i++) {
      // Get description.
      // Unescape it.
      let description = unescape(blogs[i].Description);
      // Find the first p tag and find data b/w this p.
      // Limit this to 100 word or 150 may be.
      // console.log(blogs[i].Title);
      description = this.findTextInTagAndLimit(description);
      // console.log(description);

      let blogsObject = {
        date: blogs[i].CreatedDate,
        description: description,
        // featureImage: this.globals.url + "/" + blogs[i].FeatureImage,
        imageUrl: blogs[i].ImageUrl,
        imageTitle: blogs[i].ImageTitle,
        imageAlt: blogs[i].ImageAlt,
        slug: blogs[i].Slug,
        title: blogs[i].Title
      };
      blogsList.push(blogsObject);
    }
    return blogsList;
  }

  findTextInTagAndLimit(description) {
    description.match(/<p>(.*?)<\/p>/).map(value => {
      description = value;
    });
    return description.substr(0, 120) + " ... ";
  }

  productClicked(productId) {
    // console.log(productId);

    this.catid = productId;

    this.remakeQuery();
    this.blogsService.getByQueryParams(this.query).subscribe((blogResponse: any) => {
      this.blogsResponse = blogResponse.blogs;
      this.total = blogResponse.Total;
      this.blogsList = this.makeBlogsObjectsArray(blogResponse.blogs);
      // console.log(this.blogsList);

      this.goToTop();
    });
  }
  yearsClicked(yearId) {
    // console.log(yearId);

    this.yearId = yearId;

    this.remakeQuery();
    this.blogsService.getByQueryParams(this.query).subscribe((blogResponse: any) => {
      this.blogsResponse = blogResponse.blogs;
      this.total = blogResponse.Total;
      this.blogsList = this.makeBlogsObjectsArray(blogResponse.blogs);
      // console.log(this.blogsList);
      this.goToTop();
    });
  }

  changePage(pageNumber) {
    this.pageno = pageNumber;
    this.remakeQuery();
    this.blogsService.getByQueryParams(this.query).subscribe((blogResponse: any) => {
      this.blogsResponse = blogResponse.blogs;
      this.total = blogResponse.Total;
      this.blogsList = this.makeBlogsObjectsArray(blogResponse.blogs);
      // console.log(this.blogsList);

      this.goToTop();
    });
  }

  remakeQuery() {
    // Make a joint query.
    this.query = "year=" + this.yearId + "&catid=" + this.catid + "&pageno=" + this.pageno;
    // console.log(this.query);
  }

  moreClicked(blog, index) {
    // Find the exact blog using index from blogs response.
    // console.log(this.blogsResponse[index]);
    // this.helperValuesService.blogId = this.blogsResponse[index].Id;
    // this.router.navigate(['/blog', blog.slug]);
  }
  goToTop() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementsByTagName("mat-sidenav-content")[0].scrollTo(0, 0);
    }
  }
}

// Hm yahan pr aik service banaiyen gay, jo ky call karary gi end point ko or blogs get hon gay.

// Pr yahan pr aikk baat or hy kay jo b call jay gi us may aik parameter location ka add karna.
