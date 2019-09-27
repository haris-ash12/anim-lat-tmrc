import { Injectable, Inject, PLATFORM_ID, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class StartUpService {
  private countryCode: string;
  private key: string = "2e7502e026787dcc570948b8afa7f7e2ca0da36b82fdd970c4dc8a070747e309";
  // private clientIpAddress: string;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject("countryCode") countryCode: string
  ) {
    console.log("Platform:" + platformId);
    this.countryCode = countryCode;
    console.log("startup constructor ... " + this.countryCode);
  }

  startupCall() {
    if (isPlatformBrowser(this.platformId)) {
      // return new Promise((resolve, reject) => {
      // this.httpClient.get("http://web.tmrc1.ga/api/findLocation").subscribe((res: any) => {
      //   this.countryCode = res;
      this.cookieService.set("countryCode", this.countryCode);
      console.log("startup call(), BROWSER..." + this.countryCode);
      // resolve(this.countryCode);
      // });
      // });
    }

    // if (isPlatformServer(this.platformId)) {
    //   return new Promise((resolve, reject) => {
    //     // this.httpClient.get("http://web.tmrc1.ga/api/findLocation").subscribe((res: any) => {
    //     //   this.countryCode = res;
    //     //   console.log("startup call(), SERVER..." + this.countryCode);
    //     //   resolve(this.countryCode);
    //     // });

    //     this.httpClient
    //       .get(
    //         "http://api.ipinfodb.com/v3/ip-city/?key=" +
    //           this.key +
    //           "&ip=" +
    //           this.clientIpAddress +
    //           "&format=json"
    //       )
    //       .subscribe((res: any) => {
    //         console.log(res.countryCode);
    //         this.countryCode = res.countryCode;
    //         resolve(this.countryCode);
    //         // asdf
    //       });
    //   });
    // }
  }
  get getCountryCode() {
    if (isPlatformServer(this.platformId)) {
      console.log("getCountryCOde(), SERVER..." + this.countryCode);
      return this.countryCode;
    }

    if (isPlatformBrowser(this.platformId)) {
      console.log("getCountryCOde(), BROWSER... cookie" + this.cookieService.get("countryCode"));
      console.log("getCountryCOde(), VROWSER .. normal ..." + this.countryCode);
      return this.cookieService.get("countryCode") || this.countryCode;
    }
  }

  settingBaseHref() {
    console.log("setClientBaseHref...");
    console.log("setClientBaseHref..." + this.countryCode);

    let cc = this.getCountryCode;

    if (cc.toLowerCase() === "pk") return "/";
    else {
      let urlPath;
      if (isPlatformBrowser(this.platformId)) {
        urlPath = window.location.pathname;
      }

      console.log("urlPath ..." + urlPath);
      let urlCountryCode = urlPath.split("/")[1];
      console.log("urlCOuntryCOde..." + urlCountryCode);

      if (urlCountryCode === this.getCountryCode) return "/";
      else return this.getCountryCode;
    }
  }
}
