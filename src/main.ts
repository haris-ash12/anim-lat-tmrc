import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("main.ts.............................................................");

  // apiCall()
  //   .then(res => {
  //     return res.json();
  //   })
  //   .then(countryCode => {
  //     console.log("Again response...");
  //     console.log("main.ts ... country code ... " + countryCode);

  platformBrowserDynamic([{ provide: "countryCode", useValue: "pk" }])
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
  // });
});

function apiCall() {
  const proxyurl = "";
  // const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = "http://web.tmrc1.ga/api/findLocation";
  return fetch(proxyurl + url);
}
