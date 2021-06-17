import React, { Component } from "react";
import axios from "axios";
import L from "leaflet";
import "./css/leaflet.css";
import "../../App.css";

class Home extends Component {
  state = {
    min: 0,
    max: 24,
    colors: [
      { color: "#000000", point: 0.0 },
      { color: "#550088", point: 0.14285714285714285 },
      { color: "#0000ff", point: 0.2857142857142857 },
      { color: "#00ffff", point: 0.42857142857142855 },
      { color: "#00ff00", point: 0.5714285714285714 },
      { color: "#ffff00", point: 0.7142857142857143 },
      { color: "#ff8c00", point: 0.8571428571428571 },
      { color: "#ff0000", point: 1.0 },
    ],
  };
  getColor = (value, min, max, colors) => {
    function hex(c) {
      var s = "0123456789abcdef";
      var i = parseInt(c, 10);
      if (i === 0 || isNaN(c)) return "00";
      i = Math.round(Math.min(Math.max(0, i), 255));
      return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
    }
    function trim(s) {
      return s.charAt(0) === "#" ? s.substring(1, 7) : s;
    }
    function convertToRGB(hex) {
      var color = [];
      color[0] = parseInt(trim(hex).substring(0, 2), 16);
      color[1] = parseInt(trim(hex).substring(2, 4), 16);
      color[2] = parseInt(trim(hex).substring(4, 6), 16);
      return color;
    }
    function convertToHex(rgb) {
      return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
    }

    if (value === null || isNaN(value)) {
      return "#ffffff";
    }
    if (value > max) {
      return colors[colors.length - 1].color;
    }
    if (value < min) {
      return colors[0].color;
    }
    var loc = (value - min) / (max - min);
    if (loc < 0 || loc > 1) {
      return "#fff";
    } else {
      var index = 0;
      for (var i = 0; i < colors.length - 1; i++) {
        if (loc >= colors[i].point && loc <= colors[i + 1].point) {
          index = i;
        }
      }
      var color1 = convertToRGB(colors[index].color);
      var color2 = convertToRGB(colors[index + 1].color);

      var f =
        (loc - colors[index].point) /
        (colors[index + 1].point - colors[index].point);
      var rgb = [
        color1[0] + (color2[0] - color1[0]) * f,
        color1[1] + (color2[1] - color1[1]) * f,
        color1[2] + (color2[2] - color1[2]) * f,
      ];

      return `#${convertToHex(rgb)}`;
    }
  };
  addLayers = async () => {
    const { colors, min, max } = this.state;
    const { data } = await axios
      .get("https://api.datalakes-eawag.ch/externaldata/simstrat")
      .catch((error) => {
        console.error(error);
      });
    var polygons = [];
    for (var i = 0; i < data.length; i++) {
      var pixelcolor = this.getColor(data[i].value, min, max, colors);
      polygons.push(
        L.polygon(data[i].latlng, {
          color: pixelcolor,
          fillColor: pixelcolor,
          fillOpacity: 1,
          opacity: 0,
        })
      );
    }
    L.layerGroup(polygons).addTo(this.map);
  };
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
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/jamesrunnalls/ckq0mb8fa16u017p8ktbdiclc/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamFtZXNydW5uYWxscyIsImEiOiJjazk0ZG9zd2kwM3M5M2hvYmk3YW0wdW9yIn0.uIJUZoDgaC2LfdGtgMz0cQ",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://www.mapbox.com/">mapbox</a>',
      }
    ).addTo(this.map);
    window.setTimeout(() => {
      this.addLayers();
    }, 0);
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
