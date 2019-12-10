import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

document.addEventListener("DOMContentLoaded", () => {
  // console.log("main.ts  .............................................................");

  apiCall()
    .then(res => {
      return res.json();
    })
    .then(countryCode => {
      // console.log("countrycode response, main.ts ");
      // console.log(countryCode);

      platformBrowserDynamic([
        { provide: "countryCode", useValue: countryCode }
      ])
        .bootstrapModule(AppModule)
        .catch(err => console.error(err));
    });
});

function apiCall() {
  const proxyurl = "";
  const pathName = document.location.pathname;
  // const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `http://192.168.100.200:786/admin/api/findLocation?path=${pathName}`;

  // console.log("pathName in api call() ... " + pathName);
  // console.log("apiCall() ... url :", url);
  return fetch(proxyurl + url);
}
