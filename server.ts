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
const cors = require("cors");

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), "dist/browser");

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
  console.log("server.ts .............................................................");
  // console.log(options.req.remoteAddress || options.req.header("x-forwarded-for"));

  console.log("options.req.url ... " + options.req.url);
  // let clientIPAddress = options.req.remoteAddress || options.req.header("x-forwarded-for");

  // For offline testing purposes. My ip address.
  let clientIPAddress = "115.186.141.114";
  let key = "2e7502e026787dcc570948b8afa7f7e2ca0da36b82fdd970c4dc8a070747e309";

  console.log("Client ip address..." + clientIPAddress);

  https.get(
    "https://api.ipinfodb.com/v3/ip-city/?key=" + key + "&ip=" + clientIPAddress + "&format=json",
    res => {
      let data = "";
      res.on("data", chunk => {
        data += chunk;
        console.log("Country Code ... server.ts ... from geolocation");
        let countryCode = JSON.parse(data).countryCode;
        console.log("Country Code ... server.ts ... " + countryCode);

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
      });
    }
  );
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
  res.render("index", { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
