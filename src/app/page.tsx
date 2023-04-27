"use client";
import useSWR from "swr";
import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { RiskData } from "./interface/RiskData";
const GoogleMaps = React.lazy(() => import("./components/GoogleMap"));
// import GoogleMaps from "./components/GoogleMap";
const DataTable = React.lazy(() => import("./components/DataTable"));
const LineChart = React.lazy(() => import("./components/LineChart"));
const Navbar = React.lazy(() => import("./components/Navbar"));
// import DataTable from "./components/DataTable";
// import LineChart from "./components/LineChart";
// import Navbar from "./components/Navbar";
import MoonLoader from "react-spinners/MoonLoader";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/hello", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const [selectedYear, setSelectedYear] = useState<string>("2030");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState("");
  let yearList: string[] = [];
  let assetList: string[] = [];
  let businessList: string[] = [];
  let locationListCoord: string[] = [];

  const markerClickHandler = (marker: string) => {
    setSelectedLocation(marker);
  };

  const finalData: RiskData[] = data?.map((item: any, index: number) => {
    if (!yearList.includes(item.Year.toString())) {
      yearList.push(item.Year.toString());
    }
    if (!assetList.includes(item["Asset Name"])) {
      assetList.push(item["Asset Name"]);
    }
    if (!businessList.includes(item["Business Category"])) {
      businessList.push(item["Business Category"]);
    }
    if (!locationListCoord.includes(item.Lat + "," + item.Long)) {
      locationListCoord.push(item.Lat + "," + item.Long);
    }
    return {
      id: index + 1,
      assetName: item["Asset Name"],
      Lat: item.Lat,
      Long: item.Long,
      businessCategory: item["Business Category"],
      riskRating: item["Risk Rating"],
      riskFactors: JSON.parse(item["Risk Factors"]),
      Year: item.Year.toString(),
    };
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });
  if (!isLoaded || !finalData)
    return (
      <div className="flex justify-center items-center h-screen w-screen m-auto">
        <MoonLoader
          color={"black"}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  if (error) return <div>Failed to load</div>;

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(e.target.value);
  };
  const handleBusinessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBusiness(e.target.value);
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };
  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedYear("2030");
    setSelectedAsset("");
    setSelectedBusiness("");
    setSelectedLocation("");
  };
  return (
    <>
      <Navbar />
      <div className=" flex justify-center items-center py-4 w-full gap-12 flex-wrap">
        <select
          onChange={handleYearChange}
          className=" border-2 border-black p-2 px-4 rounded-full"
        >
          {yearList.sort().map((item: string) => {
            return (
              <option value={item} key={item}>
                {Number.parseInt(item)}
              </option>
            );
          })}
        </select>
        <select
          value={selectedAsset}
          onChange={handleAssetChange}
          className=" border-2 border-black p-2 px-4 rounded-full"
        >
          <option value="">All Assets</option>
          {assetList.map((item: string) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            );
          })}
        </select>
        <select
          value={selectedBusiness}
          onChange={handleBusinessChange}
          className=" border-2 border-black p-2 px-4 rounded-full"
        >
          <option value="">All Categories</option>
          {businessList.map((item: string) => {
            return (
              <option value={item} key={item}>
                {item}
              </option>
            );
          })}
        </select>
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className=" border-2 border-black p-2 px-4 rounded-full"
        >
          <option value="">All Locations</option>
          {locationListCoord.map((item: string) => {
            return (
              <option value={item} key={item}>
                {item.replace(",", ", ")}
              </option>
            );
          })}
        </select>
        <button
          onClick={handleReset}
          className=" bg-black text-white p-2 px-4 rounded-full font-bold"
        >
          Reset
        </button>
      </div>
      <GoogleMaps
        selectedYear={selectedYear}
        finalData={finalData}
        selectedAsset={selectedAsset}
        selectedBusiness={selectedBusiness}
        selectedLocation={selectedLocation}
        markerClickHandler={markerClickHandler}
      />

      {/* Data Table */}
      <DataTable
        finalData={finalData}
        selectedYear={selectedYear}
        selectedAsset={selectedAsset}
        selectedBusiness={selectedBusiness}
        selectedLocation={selectedLocation}
      />

      {/* Line Chart */}
      <LineChart
        filteredData={finalData}
        yearList={yearList}
        selectedAsset={selectedAsset}
        selectedBusiness={selectedBusiness}
        selectedLocation={selectedLocation}
        key={selectedAsset + selectedBusiness + selectedLocation}
      />
    </>
  );
}
