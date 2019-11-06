import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NewsService } from "../services/news.service";
import { Meta, Title } from "@angular/platform-browser";
import { GlobalsService } from "../services/globals.service";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { HelperValuesService } from "../services/helper-values.service";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
  animations: [
    trigger("fade", [
      state("out", style({ opacity: 0 })),
      state("in", style({ opacity: 1 })),
      transition("out => in", animate("500ms ease"))
    ])
  ]
})
export class NewsComponent implements OnInit {
  newsObject: any = {};
  news: any[] = [];
  isAvailable: boolean;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private globals: GlobalsService,
    private meta: Meta,
    private titleSevice: Title, // private router: Router
    public helperService: HelperValuesService
  ) {
    // console.log("News component ..............................................");
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let newsSlug = params.get("slug");
      newsSlug = "slug=" + newsSlug;

      this.newsService.getByQueryParams(newsSlug).subscribe((news: any) => {
        // this.router.navigateByUrl("/");

        // console.log("news...");
        // console.log(news);

        let newsDescription = unescape(news.Description);

        // Remove <p></p> from <p><img ></p>, so that only <img > remains.
        newsDescription = newsDescription.replace(/<p><img(.*?)><\/p>/g, value => {
          let valueWithNoPtag = value.replace(/<\/?p>/g, "");
          let valueWithNoStyle = valueWithNoPtag.replace(/style="(.*?)"/g, "");

          return valueWithNoStyle;
        });

        let newsObj = {
          title: news.Title,
          datePosted: news.CreatedDate,
          description: newsDescription,
          imageUrl: news.ImageUrl,
          imageAlt: news.ImageAlt,
          imageTitle: news.ImageTitle,
          metaDescription: news.MetaDescription,
          metaKeywords: news.MetaKeywords,
          pageTitle: news.PageTitle
        };

        this.newsObject = newsObj;

        // console.log("newsobj............................");
        // console.log(newsObj);

        this.titleSevice.setTitle(this.newsObject.pageTitle);
        this.meta.updateTag({ name: "keywords", content: this.newsObject.metaKeywords });
        this.meta.updateTag({ name: "description", content: this.newsObject.metaDescription });

        this.isAvailable = true;
      });
    });

    this.newsService.getAll().subscribe((newsResponse: any[]) => {
      // console.log("news response...");
      // console.log(newsResponse);

      for (let i = 0; i < newsResponse.length; i++) {
        let isRedirectionActive: boolean;
        if (!newsResponse[i].RedirectionUrl || !newsResponse[i].RedirectionType) {
          isRedirectionActive = false;
        } else {
          isRedirectionActive = true;
        }

        let newsObject = {
          title: newsResponse[i].Title,
          datePosted: newsResponse[i].CreatedDate,
          slug: newsResponse[i].Slug,
          redirectionUrl: newsResponse[i].RedirectionUrl,
          redirectionType: newsResponse[i].RedirectionType,
          isRedirectionActive: isRedirectionActive
        };
        this.news.push(newsObject);
      }
      // console.log(this.news);
    });
  }
}
