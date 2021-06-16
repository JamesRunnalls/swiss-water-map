import React, { Component } from "react";
import axios from "axios";
import L from "leaflet";
import "./css/leaflet.css";
import "../../App.css";

class Home extends Component {
  async componentDidMount() {
    this.map = L.map("map", {
      preferCanvas: true,
      zoomControl: false,
      center: [46.8, 8.2],
      zoom: 9,
      minZoom: 5,
      maxZoom: 15,
      maxBoundsViscosity: 0.5,
    });
    var map = this.map;

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/jamesrunnalls/ckpwdp8ni5g0717mec9b2cr97/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFtZXNydW5uYWxscyIsImEiOiJjazk0ZG9zd2kwM3M5M2hvYmk3YW0wdW9yIn0.uIJUZoDgaC2LfdGtgMz0cQ",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://www.mapbox.com/">mapbox</a>',
      }
    ).addTo(map);
  }

  render() {
    document.title = "Swiss Water Map";
    return (
      <React.Fragment>
        <div id="map" className="home"></div>
      </React.Fragment>
    );
  }
}

export default Home;
