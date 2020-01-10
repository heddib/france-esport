<template>
  <Page>
    <ActionBar title="France Esport" />
    <GridLayout columns="*" rows="*">
      <MapView
        :latitude="latitude"
        :longitude="longitude"
        :zoom="zoom"
        @mapReady="onMapReady"
        @markerSelect="onMarkerSelect"
        mapAnimationsEnabled="true"
        iosOverflowSafeArea="true"
      >
      </MapView>
      <Switch
        checked="true"
        class="switch"
        @loaded="loadSwitch"
      />
    </GridLayout>
  </Page>
</template>

<script>
const appSettings = require("tns-core-modules/application-settings");
import { MapView, Marker, Position } from "nativescript-google-maps-sdk";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums"; // used to describe at what accuracy the location should be get
import { mapStyleDark } from "./mapStyle";
import { mapStyle } from "./mapStyle";
import * as permissions from "nativescript-permissions";
import * as platform from "platform";
import * as http from "tns-core-modules/http";
import { validateCode, getJson } from "./Util";

const Detail = {
  props: ["marker"],
  template: `
    <Page>
      <ActionBar title="Détails" style="background-color: #53ba82;color: #ffffff;" />
      <StackLayout>
        <Label :text="marker.title" />
        <TextView :text="marker.snippet" />
        <Button @tap="$navigateBack" text="Fermer" />
      </StackLayout>
    </Page>
  `
};

export default {
  data() {
    return {
      latitude: 48.8534,
      longitude: 2.3488,
      zoom: 7,
      minZoom: 7,
      maxZoom: 17,
      mapView: undefined,
      ready: false,
      events: [],
      nightmode: true
    };
  },
  mounted() {},
  created() {
    this.nightmode = appSettings.getBoolean("nightmode", true);
    if (platform.isIOS) {
      geolocation.enableLocationRequest();
      this.ready = true;
      return;
    }
    /* list of permissions needed */
    let permissionsNeeded = [
      android.Manifest.permission.ACCESS_FINE_LOCATION,
      android.Manifest.permission.ACCESS_COARSE_LOCATION
    ];
    /* showing up permissions dialog */
    permissions
      .requestPermissions(
        permissionsNeeded,
        "Pour te localiser sur la carte :)"
      )
      .then(() => (this.ready = true))
      .catch(() => (this.ready = false));
  },
  methods: {
    loadSwitch(args) {
      const mySwitch = args.object;
      mySwitch.on("checkedChange", args => {
        const sw = args.object;
        const isChecked = sw.checked;
        console.log(`Switch new value ${isChecked}`);
        this.nightmode = isChecked;
        appSettings.setBoolean("nightmode", this.nightmode);
        this.updateMap();
      });
    },
    updateMap() {
      this.mapView.setStyle(this.nightmode ? mapStyleDark : mapStyle);
    },
    onMarkerSelect(args) {
      console.log("Clicked on " + args.marker.title);
      this.$navigateTo(Detail, {
        transition: {},
        transitioniOS: {},
        transitionAndroid: {},

        props: {
          marker: args.marker
        }
      });
    },

    fetchEvents() {
      return http
        .request({
          url: "https://ionia-server.herokuapp.com/api/v1/events",
          method: "GET"
        })
        .then(validateCode)
        .then(getJson)
        .then(data => {
          let thedata = JSON.parse(data.content);
          this.addEvents(thedata.data);
        });
    },

    addEvents(events) {
      this.events = events;
      this.events.forEach(event => {
        this.addMarker(event.title, event.description, event.lat, event.lng);
      });
    },

    addMarker(title, desc, lat, lng, icon) {
      const marker = new Marker();
      marker.title = title;
      marker.snippet = desc;
      this.addMarkerToMap(marker, lat, lng, icon);
    },

    addMarkerToMap(marker, lat, lng, icon) {
      marker.position = Position.positionFromLatLng(lat, lng);
      marker.color = "#53ba82";
      if (icon !== undefined) marker.icon = icon;
      this.mapView.addMarker(marker);
    },

    fetchMyLocation() {
      geolocation
        .getCurrentLocation({
          desiredAccuracy: Accuracy.high,
          maximumAge: 1000,
          timeout: 20000
        })
        .then(res => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;

          const marker = new Marker();
          marker.position = Position.positionFromLatLng(
            this.latitude,
            this.longitude
          );
          marker.title = "T'es ici";
          marker.snippet = "C'est précis mdr";
          marker.color = "#5f78e7";
          this.mapView.addMarker(marker);
        })
        .catch(e => {
          console.log("oh frak, error", e);
        });
    },

    onMapReady(event) {
      console.log("Map ready!");
      this.mapView = event.object;
      this.fetchMyLocation();
      this.fetchEvents();

      this.mapView.setStyle(this.nightmode ? mapStyleDark : mapStyle);
    }
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
