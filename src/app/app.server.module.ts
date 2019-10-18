import { NgModule, Injectable, Inject } from "@angular/core";
import { ServerModule } from "@angular/platform-server";
import { Request } from "express";
import { REQUEST } from "@nguniversal/express-engine/tokens";

import { AppModule } from "./app.module";
import { AppComponent } from "./app.component";
import { ModuleMapLoaderModule } from "@nguniversal/module-map-ngfactory-loader";
import { ServerCookieService } from "./services/server-cookie.service";
import { APP_BASE_HREF } from "@angular/common";
import { StartUpService } from "./services/start-up.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatButtonModule
} from "@angular/material";
import { SlideshowModule } from "ng-simple-slideshow";
import { ScrollingModule } from "@angular/cdk/scrolling";

export function setBaseHref(provider: StartUpService) {
  console.log("setBaseHref...");
  console.log("setBaseHref..." + provider.getCountryCode);
  return provider.getCountryCode;
}

@Injectable()
export class RequestCookies {
  constructor(@Inject(REQUEST) private request: Request) {}

  get cookies() {
    // console.log(this.request.headers.cookie ? this.request.headers.cookie : null);
    return !!this.request.headers.cookie ? this.request.headers.cookie : null;
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    // FlexLayoutModule,
    SlideshowModule,
    ScrollingModule
  ],
  providers: [
    ServerCookieService,
    { provide: "req", useClass: RequestCookies }
    // {
    //   provide: APP_BASE_HREF,
    //   useFactory: setBaseHref,
    //   deps: [StartUpService]
    // }

    // This part is causing issue now....
    // {
    //   provide: APP_BASE_HREF,
    //   useValue: "/PK"
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
