/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */

import "zone.js/dist/zone-node";

import * as express from "express";
import { join } from "path";
const https = require("https");
const http = require("http");
const cors = require("cors");
const compression = require("compression");

// Express server
const app = express();
app.use(compression());

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), "dist/browser");

let countryCode = "";

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
  ngExpressEngine,
  provideModuleMap
} = require("./dist/server/main");

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
// app.engine('html', ngExpressEngine({
//   bootstrap: AppServerModuleNgFactory,
//   providers: [
//     provideModuleMap(LAZY_MODULE_MAP)
//   ]
// }));

app.use(cors());

app.engine("html", (_, options, callback) => {
  // console.log("server.ts .............................................................");
  // console.log("COuntry code in app engine ..." + countryCode);
  // console.log(options.req.remoteAddress || options.req.header("x-forwarded-for"));

  // console.log("options.req.url ... " + options.req.url);

  // if (options.req.url == "/") {
  //   options.res.render(302, "http://localhost:4000/blog");
  // }

  // let clientIPAddress = options.req.remoteAddress || options.req.header("x-forwarded-for");

  // For offline testing purposes. My ip address.
  //let clientIPAddress = "115.186.141.114";
  // let key = "2e7502e026787dcc570948b8afa7f7e2ca0da36b82fdd970c4dc8a070747e309";

  // console.log("Client ip address... in engine" + clientIPAddress);

  // https.get(
  //   "https://api.ipinfodb.com/v3/ip-city/?key=" + key + "&ip=" + clientIPAddress + "&format=json",
  //   res => {
  //     let data = "";
  //     res.on("data", chunk => {
  //       data += chunk;
  //       console.log("Country Code ... server.ts ... from geolocation");
  //       let countryCode = JSON.parse(data).countryCode;
  //       console.log("Country Code ... server.ts ... " + countryCode);

  //       console.log("in engine...." + haris);

  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
      provideModuleMap(LAZY_MODULE_MAP),
      // {
      //   provide: "clientIPAddress",
      //   useValue: options.req.remoteAddress || options.req.header("x-forwarded-for") //Provides the client IP address to angular
      // }
      { provide: "countryCode", useValue: countryCode }
    ]
  })(_, options, callback);
  //     });
  //   }
  // );
});

app.set("view engine", "html");
app.set("views", DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get(
  "*.*",
  express.static(DIST_FOLDER, {
    maxAge: "1y"
  })
);

// All regular routes use the Universal engine
app.get("*", (req, res) => {
  // First thing called is this, then appEngine is called.

  // console.log(
  //   "server.ts  ................................................................................."
  // );
  // console.log({ req });

  // Domain name
  var host = req.get("host");
  // console.log("Host .....");
  // console.log(host);

  // Protocol, can be either http / https
  // console.log("Protocol");
  // console.log(req.protocol);
  var protocol = req.protocol;

  // URL starting from root
  let routeSlug = req.url;
  // console.log("route slug ...");
  // console.log(routeSlug);

  // Get client Ip Address or use hard-coded ip value.
  // let clientIPAddress = req.remoteAddress || req.header("x-forwarded-for");

  // This thing should be used for real IP.
  // This should be used as IP as it is also working on windows server
  let clientIPAddress = req.remoteAddress || req.header("X-forwarded-for");

  // let clientIPAddress =
  //   req.headers["x-forwarded-for"] ||
  //   req.connection.remoteAddress ||
  //   req.socket.remoteAddress ||
  //   req.connection.socket.remoteAddress;

  // For offline testing purposes. My ip address.
  // let clientIPAddress = "115.186.141.114";

  // console.log("CLient Ip Address ....." + clientIPAddress);

  let key = "2e7502e026787dcc570948b8afa7f7e2ca0da36b82fdd970c4dc8a070747e309";

  http.get(
    "http://api.ipinfodb.com/v3/ip-city/?key=" +
      key +
      "&ip=" +
      clientIPAddress +
      "&format=json",
    response => {
      let data = "";
      response.on("data", chunk => {
        data += chunk;
        // console.log("Country Code ... server.ts ... from geolocation");
        let cc = JSON.parse(data).countryCode;
        // console.log("Country Code ... server.ts ... " + countryCode);

        // Now that we have found the country code, We need to find that whether redirection exists againt this route or not.
        http.get(
          `http://192.168.100.200:786/admin/api/GetRedirection?countrycode=${cc}&slug=${routeSlug}&hostName=${protocol}://${host}`,
          redirectionResponse => {
            let data = "";
            redirectionResponse.on("data", chunk => {
              data += chunk;

              // console.log("Redirection call ...");
              // console.log(data);

              let redirection = JSON.parse(data);
              countryCode = redirection.countrycode;

              let redirectionUrl: any;
              let redirectionType: any;

              if (!redirection) {
                // console.log("! redirection ....");
                // console.log(redirection);
                redirectionUrl = null;
                redirectionType = null;
                // res.render("index", { req });

                // res.end();
              } else if (redirection) {
                redirectionUrl = redirection.RedirectionUrl;
                redirectionType = redirection.RedirectionType;
                // console.log(
                //   redirection.RedirectionUrl +
                //     "... &  ..." +
                //     redirection.RedirectionType
                // );
              }

              if (redirectionUrl && redirectionType) {
                // I think, "location" as first parameter was compulsory to add.
                res.set("location", redirectionUrl);
                // console.log("1");
                res.status(redirectionType).send();
                // console.log("2");
                // res.render("index", { req });
                // console.log("Redirection wali if statment ...");
              } else {
                res.render("index", { req });
                // console.log("Else wali if statement ...");
              }

              // FOr checking .....

              // if (req.url === "/blog/test-1") {
              //   res.set("location", "http://localhost:4000/blog/test-2");
              //   res.status(302).send();
              // } else {
              //   res.render("index", { req });
              // }
            });
          }
        );
      });
    }
  );

  // haris = "pk";
  // setTimeout(() => {
  //   console.log("In set time out function() ... ");
  //   console.log("in app.get() ...." + haris);

  //   res.render("index", { req });
  // }, 3000);

  // So this part is called first ....
  // What i can do is, i can perform the other complexity work here. & then go to the top.

  // if (req.url === "/test") {
  //   // res.setHeader("Content-Type", "text/plain");
  //   // res.redirect(301, "http://localhost:4000/careers/1/apply");
  //   // res.end();

  //   res.set("location", "http://localhost:4000/careers/1/apply");
  //   res.status(301).send();
  // }
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

// function findRedirection(countryCode, routeSlug) {
//   return "";
// }
