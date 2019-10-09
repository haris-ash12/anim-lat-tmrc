import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StartUpService } from "./start-up.service";
import { GlobalsService } from "./globals.service";

// @Injectable({
//   providedIn: "root"
// })
export class DataService {
  startupService: StartUpService;
  private countryCode: string;
  private url: string;

  constructor(private endPoint: string, private httpClient: HttpClient, injector: Injector) {
    const globals = new GlobalsService();
    this.url = globals.url;
    // No need to pass startup service as a paramter in constructor,
    // otherwise there will be lots of changes.
    // const startupService = new StartUpService(httpClient);
    this.startupService = injector.get(StartUpService);
    // So we make the call and get the country code here(Getter method).
    this.countryCode = "countryCode=" + this.startupService.getCountryCode;

    //...
    // console.log(`${this.url}/${this.endPoint}/`);
  }

  getAll() {
    return this.httpClient.get(`${this.url}/${this.endPoint}/` + "?" + this.countryCode);
  }

  getByQueryParams(queryParams: string) {
    // console.log('Data service query ...');
    // console.log(this.url + '?' + this.countryCode + '&' + queryParams);
    return this.httpClient.get(
      `${this.url}/${this.endPoint}/` + "?" + this.countryCode + "&" + queryParams
    );
  }

  create(response) {
    return this.httpClient.post(`${this.url}/${this.endPoint}/` + "?" + this.countryCode, response);
  }
}
