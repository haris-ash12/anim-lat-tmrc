import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GlobalsService {
  url: string = "https://tmrconsult.com/admin";

  constructor() {}
}
