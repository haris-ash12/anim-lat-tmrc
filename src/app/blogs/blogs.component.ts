import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BlogsService } from "../services/blogs.service";
import { ProductsService } from "../services/products.service";
import { HelperValuesService } from "../services/helper-values.service";
import { Router } from "@angular/router";
import { GlobalsService } from "../services/globals.service";
import { isPlatformBrowser } from "@angular/common";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-blogs",
  templateUrl: "./blogs.component.html",
  styleUrls: ["./blogs.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class BlogsComponent implements OnInit {
  blogsResponse: any[] = [];
  blogsList: any[] = [];
  productsList: any[] = [];
  yearsList: any[] = [];

  query: string;
  yearId: number;
  catid: number;
  tags: string;
  pageno: number;
  total: number;

  isAvailable: boolean;

  constructor(
    private blogsService: BlogsService,
    private productsService: ProductsService,
    private helperService: HelperValuesService,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log("Blog components ........................................................");

    // These would be our initial values for the query.
    this.yearId = 2019;
    this.catid = 0;
    this.tags = "";
    this.pageno = 1;

    // Check values if it is navigating back from blog details.
    if (this.helperService.productId) this.catid = this.helperService.productId;
    else if (this.helperService.yearId) this.yearId = this.helperService.yearId;

    // Make a joint query.
    this.query =
      "year=" +
      this.yearId +
      "&catid=" +
      this.catid +
      "&pageno=" +
      this.pageno +
      "&tags=" +
      this.tags;
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
      // console.log("Products response ...");
      // console.log(productsResponse);

      for (let i = 0; i < productsResponse.length; i++) {
        let productObject = {
          title: productsResponse[i].CatName,
          id: productsResponse[i].Id
        };
        this.productsList.push(productObject);
      }
      // console.log("Products List ...");
      // console.log(this.productsList);
    });

    // --- BLOGS ---
    this.blogsService.getByQueryParams(this.query).subscribe((blogResponse: any) => {
      // BlogsResposne is an object with two properties, total and blogs Array..
      // And we need blogs array, blogs property.

      this.blogsResponse = blogResponse.blogs;
      console.log("Blogs response ................................");
      console.log(this.blogsResponse);

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

      this.isAvailable = true;
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

      let isRedirectionActive: boolean;
      if (!blogs[i].RedirectionUrl || !blogs[i].RedirectionType) {
        isRedirectionActive = false;
      } else {
        isRedirectionActive = true;
      }

      let blogsObject = {
        date: blogs[i].CreatedDate,
        description: description,
        imageUrl: blogs[i].ImageUrl,
        imageTitle: blogs[i].ImageTitle,
        imageAlt: blogs[i].ImageAlt,
        slug: blogs[i].Slug,
        title: blogs[i].Title,
        redirectionUrl: blogs[i].RedirectionUrl,
        redirectionType: blogs[i].RedirectionType,
        isRedirectionActive: isRedirectionActive
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
      console.log("Products clicked.....");
      console.log(this.blogsList);

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
      console.log("Years Clicked ...");
      console.log(this.blogsList);
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
    this.query =
      "year=" +
      this.yearId +
      "&catid=" +
      this.catid +
      "&pageno=" +
      this.pageno +
      "&tags=" +
      this.tags;
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

  searchBlog(f) {
    console.log(f.value);

    this.tags = f.value;
    this.remakeQuery();
    this.blogsService.getByQueryParams(this.query).subscribe((blogResponse: any) => {
      this.blogsResponse = blogResponse.blogs;
      this.total = blogResponse.Total;
      this.blogsList = this.makeBlogsObjectsArray(blogResponse.blogs);
      // console.log(this.blogsList);

      this.goToTop();
    });
  }
}

// Hm yahan pr aik service banaiyen gay, jo ky call karary gi end point ko or blogs get hon gay.

// Pr yahan pr aikk baat or hy kay jo b call jay gi us may aik parameter location ka add karna.
