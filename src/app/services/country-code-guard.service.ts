import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { StartUpService } from "./start-up.service";

@Injectable({
  providedIn: "root"
})
export class CountryCodeGuardService implements CanActivate {
  constructor(private startupService: StartUpService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log("Auth Guard service ... ");
    let cc = this.startupService.getCountryCode;
    if (cc.toLowerCase() === "pk") return true;
  }
}
