import Vue from "nativescript-vue";
import App from "./components/App";

import VueDevtools from "nativescript-vue-devtools";

import * as platform from "tns-core-modules/platform";
import { MapView } from "nativescript-google-maps-sdk";

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools);
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production";

if (platform.isIOS) {
  GMSServices.provideAPIKey("AIzaSyBxi4Y8BaTjYFwP_OokaCuuntXlF50ogNs");
}

Vue.registerElement("MapView", () => MapView);

new Vue({
  render: h => h("frame", [h(App)])
}).$start();
