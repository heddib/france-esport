<template>
  <Page>
    <ActionBar title="France Esport" />
    <GridLayout columns="*" rows="*">
      <!--<Label class="message" :text="msg" col="0" row="0"/>-->
      <MapView
        :latitude="latitude"
        :longitude="longitude"
        :zoom="zoom"
        :minZoom="minZoom"
        :maxZoom="maxZoom"
        @mapReady="onMapReady"
        
      ></MapView>
    </GridLayout>
  </Page>
</template>

<script>
import { MapView, Marker, Position } from "nativescript-google-maps-sdk";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums"; // used to describe at what accuracy the location should be get

export default {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      zoom: 7,
      minZoom: 7,
      maxZoom: 22,
      mapView: undefined,
      ready: false
    };
  },
  methods: {
    created() {
      geolocation.enableLocationRequest();
      this.ready = true;
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
          marker.userData = { index: 1 };
          this.mapView.addMarker(marker);
        })
        .catch(e => {
          console.log("oh frak, error", e);
        });
    },
    onMapReady(event) {
      console.log("Map ready!");
      this.mapView = event.object;
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
