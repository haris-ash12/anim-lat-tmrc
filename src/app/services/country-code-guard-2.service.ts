import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { StartUpService } from "./start-up.service";

@Injectable({
  providedIn: "root"
})
export class CountryCodeGuard2Service implements CanActivate {
  constructor(private startupService: StartUpService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log("Country code guard service 2 kicks in  ... ", state.url);

    let cc = this.startupService.getCountryCode;
    // console.log("This is the country code in [2] ... ", cc);

    // If country code !== pk, means if it is us/uk/ca etc then we want these routes to open.
    // And if country code is pk, we return false, so that these routes will not open.
    if (cc.toLowerCase() !== "pk") {
      // console.log("Country code !== pk in [2]");
      return true;
    } else {
      // console.log("country code === pk in [2] ...");
      return false;
    }
  }
}
