import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgxPaginationModule } from "ngx-pagination";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatIconModule
} from "@angular/material";

import { ScrollingModule } from "@angular/cdk/scrolling";
// import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SlideshowModule } from "ng-simple-slideshow";
import { CookieService } from "ngx-cookie-service";

import { AppComponent } from "./app.component";
import { BlogsComponent } from "./blogs/blogs.component";
import { BlogDetailComponent } from "./blog-detail/blog-detail.component";
import { LocationService } from "./services/location.service";
import { APP_BASE_HREF, isPlatformBrowser } from "@angular/common";
// import { SpecificComponent } from "./specific/specific.component";
import { HomeComponent } from "./home/home.component";
import { StartUpService } from "./services/start-up.service";

import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { async } from "@angular/core/testing";

// import { TestComponent } from "./test/test.component";
import { FooterComponent } from "./footer/footer.component";
import { GenericComponent } from "./generic/generic.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { LoaderComponent } from "./loader/loader.component";
import { LoaderInterceptorService } from "./services/loader-interceptor.service";
import { NewsComponent } from "./news/news.component";
// import { NavigationBarComponent } from "./navigation-bar/navigation-bar.component";
import { CareersComponent } from "./careers/careers.component";
import { CareersSpecificComponent } from "./careers-specific/careers-specific.component";
// import { CareersApplyComponent } from "./careers-apply/careers-apply.component";
import { ServerCookieService } from "./services/server-cookie.service";
import { CountryCodeGuardService } from "./services/country-code-guard.service";
import { ContactComponent } from "./contact/contact.component";
import { TrainingsComponent } from "./trainings/trainings.component";
import { TrainingDetailComponent } from "./training-detail/training-detail.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { CountryCodeGuard2Service } from "./services/country-code-guard-2.service";

export function startupProviderFactory(provider: StartUpService) {
  // console.log('provider.startupcall..');
  // provider.startupCall().then(res => console.log(res));

  return () => provider.startupCall();
}

export function setClientBaseHref(provider: StartUpService) {
  // console.log("setClientBaseHref() called in app module.ts ......");
  // console.log("value ...", provider.settingBaseHref());
  return provider.settingBaseHref();
}
export function starti(provider: StartUpService) {
  // console.log('provide country code');

  // console.log(provider.CountryCode);
  // let val = await provider.startupCall();
  // console.log('val ...' + val);

  // return '/a';

  return "/pk";
}

@NgModule({
  declarations: [
    AppComponent,
    BlogsComponent,
    BlogDetailComponent,
    // SpecificComponent,
    HomeComponent,
    // TestComponent,
    FooterComponent,
    GenericComponent,
    MainNavComponent,
    LoaderComponent,
    NewsComponent,
    // NavigationBarComponent,
    CareersComponent,
    CareersSpecificComponent,
    // CareersApplyComponent,
    ContactComponent,
    TrainingsComponent,
    TrainingDetailComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    RouterModule.forRoot(
      [
        // {
        //   path: "",
        //   // canActivate: [CountryCodeGuardService],
        //   children: [
        { path: "", component: HomeComponent, canActivate: [CountryCodeGuardService] },
        // { path: "test", component: TestComponent },
        { path: "blog", component: BlogsComponent, canActivate: [CountryCodeGuardService] },
        {
          path: "trainings",
          component: TrainingsComponent,
          canActivate: [CountryCodeGuardService]
        },
        { path: "careers", component: CareersComponent, canActivate: [CountryCodeGuardService] },
        {
          path: "about-us/contact-us",
          component: ContactComponent,
          canActivate: [CountryCodeGuardService]
        },
        {
          path: "blog/:slug",
          component: BlogDetailComponent,
          canActivate: [CountryCodeGuardService]
        },
        {
          path: "trainings/:slug",
          component: TrainingDetailComponent,
          canActivate: [CountryCodeGuardService]
        },
        {
          path: "careers/:specificCareer",
          component: CareersSpecificComponent,
          canActivate: [CountryCodeGuardService]
        },
        {
          path: "news/:slug",
          component: NewsComponent,
          canActivate: [CountryCodeGuardService]
        },
        {
          path: ":cc",
          component: HomeComponent,
          canActivate: [CountryCodeGuard2Service]
        },
        { path: ":cc/blog", component: BlogsComponent, canActivate: [CountryCodeGuard2Service] },
        {
          path: ":cc/trainings",
          component: TrainingsComponent,
          canActivate: [CountryCodeGuard2Service]
        },
        {
          path: ":cc/careers",
          component: CareersComponent,
          canActivate: [CountryCodeGuard2Service]
        },

        {
          path: ":menu/:submenu",
          component: GenericComponent,
          canActivate: [CountryCodeGuardService]
        },

        {
          path: ":cc/about-us/contact-us",
          component: ContactComponent,
          canActivate: [CountryCodeGuard2Service]
        },
        {
          path: ":cc/blog/:slug",
          component: BlogDetailComponent,
          canActivate: [CountryCodeGuard2Service]
        },

        {
          path: ":cc/trainings/:slug",
          component: TrainingDetailComponent,
          canActivate: [CountryCodeGuard2Service]
        },
        {
          path: ":cc/careers/:specificCareer",
          component: CareersSpecificComponent,
          canActivate: [CountryCodeGuard2Service]
        },

        {
          path: ":cc/news/:slug",
          component: NewsComponent,
          canActivate: [CountryCodeGuard2Service]
        },
        {
          path: ":cc/:menu/:submenu",
          component: GenericComponent,
          canActivate: [CountryCodeGuard2Service]
        },

        // {
        //   path: ':countryCode',
        //   component: SpecificComponent,
        //   children: [

        // { path: "careers/:specificCareer/apply", component: CareersApplyComponent },

        // {
        //   path: ":cc/:menu/:submenu",
        //   component: GenericComponent,
        //   canActivate: [CountryCodeGuard2Service]
        // },

        // {
        //   path: ":cc",
        //   canActivate: [CountryCodeGuard2Service],
        //   children: [
        //     { path: "", component: HomeComponent },
        //     // { path: "test", component: TestComponent },
        //     // {
        //     //   path: ':countryCode',
        //     //   component: SpecificComponent,
        //     //   children: [
        //     { path: "about-us/contact-us", component: ContactComponent },

        //     { path: "news/:slug", component: NewsComponent },

        //     { path: "careers", component: CareersComponent },
        //     { path: "careers/:specificCareer", component: CareersSpecificComponent },
        //     // { path: "careers/:specificCareer/apply", component: CareersApplyComponent },

        //     { path: "blog", component: BlogsComponent },
        //     { path: "blog/:slug", component: BlogDetailComponent },

        //     { path: "trainings", component: TrainingsComponent },
        //     { path: "trainings/:slug", component: TrainingDetailComponent },

        //     { path: ":menu/:submenu", component: GenericComponent },
        //     { path: "**", component: NotFoundComponent }
        //   ]
        // },

        { path: "**", component: NotFoundComponent }
        //   ]
        // }
      ],
      {
        // scrollPositionRestoration: "top"
        anchorScrolling: "enabled",
        scrollOffset: [0, -200] // [x, y]
      }
    ),
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    // FlexLayoutModule,
    SlideshowModule,
    ScrollingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: startupProviderFactory,
      deps: [StartUpService],
      multi: true
    },
    // {
    //   provide: APP_BASE_HREF,
    //   useFactory: setClientBaseHref,
    //   deps: [StartUpService]
    // },

    // This part is causing issue now...
    // {
    //   provide: APP_BASE_HREF,
    //   useValue: "/abc"
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    CookieService,
    Title,
    ServerCookieService,
    {
      provide: "req",
      useValue: null
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
