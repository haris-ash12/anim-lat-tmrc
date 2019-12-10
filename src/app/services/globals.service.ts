import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GlobalsService {
  url: string = "http://192.168.100.200:786/admin";

  constructor() {}
}
