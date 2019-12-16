import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GlobalsService {
  url: string = "http://52.155.227.188/admin";

  constructor() {}
}
