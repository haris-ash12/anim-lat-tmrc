import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  RouterLink
} from "@angular/router";
import { StartUpService } from "./start-up.service";

@Injectable({
  providedIn: "root"
})
export class CountryCodeGuardService implements CanActivate {
  constructor(private startupService: StartUpService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log("Country code guard service 1 kicks in  ... ", state.url);
    let cc = this.startupService.getCountryCode;
    // console.log("This is the country code [1] ... ", cc);

    // If country code is pk, we want these routes to open[true], else redirect them to /:cc routes and return false.
    if (cc.toLowerCase() === "pk") {
      // console.log("Country code === pk in [1] ...");
      return true;
    } else {
      let routeArray = ["/", cc];

      let currentRoutes = state.url.split("/");

      if (currentRoutes.length > 0) {
        for (let i = 1; i < currentRoutes.length; i++) {
          // If currentROutes has a value, means it is not empty, then push that value in array.
          if (currentRoutes[i]) {
            routeArray.push(currentRoutes[i]);
          }
        }
      }

      this.router.navigate(routeArray);
      // console.log("country code !== pk in [1] ...");
      return false;
    }
  }
}
