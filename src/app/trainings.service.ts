import { Injectable, Injector } from "@angular/core";
import { DataService } from "./services/data.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class TrainingsService extends DataService {
  constructor(httpClient: HttpClient, injector: Injector) {
    super("api/GetTrainings", httpClient, injector);
  }
}
