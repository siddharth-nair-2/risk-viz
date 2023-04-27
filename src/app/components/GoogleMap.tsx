"use client";

import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { RiskData } from "../interface/RiskData";
import { useState } from "react";

interface GoogleMapsProps {
  selectedYear: string;
  finalData: any;
  selectedAsset: string;
  selectedBusiness: string;
  selectedLocation: string;
  markerClickHandler: (data: string) => void;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({
  selectedYear,
  finalData,
  selectedAsset,
  selectedBusiness,
  selectedLocation,
  markerClickHandler,
}) => {
  const [defaultLat, setDefaultLat] = useState(56.1304);
  const [defaultLng, setDefaultLng] = useState(-96.3468);
  const [defaultZoom, setDefaultZoom] = useState(4);

  const getMarkerIcon = (riskRating: number) => {
    let color = "green";
    if (riskRating >= 0.8) {
      color = "red";
    } else if (riskRating >= 0.6) {
      color = "orange";
    } else if (riskRating >= 0.4) {
      color = "yellow";
    } else if (riskRating >= 0.2) {
      color = "blue";
    }
    return {
      url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
      scaledSize: new window.google.maps.Size(30, 30),
    };
  };

  const onMarkerClick = (e: google.maps.MapMouseEvent) => {
    markerClickHandler(`${e.latLng?.lat()},${e.latLng?.lng()}`);
    setDefaultLat(e.latLng?.lat() || 56.1304);
    setDefaultLng(e.latLng?.lng() || -96.3468);
  };

  return (
    <GoogleMap
      center={{ lat: defaultLat, lng: defaultLng }}
      zoom={defaultZoom}
      mapContainerClassName=" w-[80vw] h-[80vh] m-auto"
      key={selectedYear + " " + selectedAsset}
    >
      {finalData.map((marker: RiskData, index: number) => {
        let lat: number = 0,
          lng: number = 0;
        if (!selectedLocation || selectedLocation !== "") {
          lat = Number.parseFloat(selectedLocation.split(",")[0]);
          lng = Number.parseFloat(selectedLocation.split(",")[1]);
        }
        if (
          (marker.assetName === selectedAsset || !selectedAsset) &&
          (marker.Year === selectedYear || !selectedYear) &&
          (marker.businessCategory === selectedBusiness || !selectedBusiness) &&
          ((marker.Lat === lat && marker.Long === lng) || !selectedLocation)
        ) {
          const icon = getMarkerIcon(marker.riskRating);
          return (
            <MarkerF
              key={index + selectedAsset + selectedYear}
              icon={icon}
              onClick={onMarkerClick}
              options={{
                title: `${marker.assetName}: ${marker.businessCategory}, ${marker.Year}`,
              }}
              position={{ lat: marker.Lat, lng: marker.Long }}
            />
          );
        }
        return null;
      })}
    </GoogleMap>
  );
};

export default GoogleMaps;
