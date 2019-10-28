import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GlobalsService {
  url: string = "http://maintmrc.ga/admin";

  constructor() {}
}
