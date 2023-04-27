"use client";
import { Line } from "react-chartjs-2";
import { RiskData } from "../interface/RiskData";
import { useState } from "react";
import "chart.js/auto";

interface LineChartProps {
  filteredData: RiskData[];
  yearList: string[];
  selectedAsset: string;
  selectedBusiness: string;
  selectedLocation: string;
}

const LineChart: React.FC<LineChartProps> = ({
  filteredData,
  yearList,
  selectedAsset,
  selectedBusiness,
  selectedLocation,
}) => {
  const [rowData, setRowData] = useState(
    filteredData
      .filter(
        (data) => data.assetName === selectedAsset || selectedAsset === ""
      )
      .filter(
        (data) =>
          data.businessCategory === selectedBusiness || selectedBusiness === ""
      )
      .filter(
        (data) =>
          (data.Lat === Number.parseFloat(selectedLocation.split(",")[0]) &&
            data.Long === Number.parseFloat(selectedLocation.split(",")[1])) ||
          selectedLocation === ""
      )
      .filter(
        (data) =>
          !(
            selectedAsset === "" &&
            selectedBusiness === "" &&
            selectedLocation === ""
          )
      )
      .map((item) => {
        if (
          item.assetName === selectedAsset ||
          item.businessCategory === selectedBusiness ||
          (item.Lat === Number.parseFloat(selectedLocation.split(",")[0]) &&
            item.Long === Number.parseFloat(selectedLocation.split(",")[1]))
        )
          return {
            item: {
              id: item.id,
              assetName: item.assetName,
              businessCategory: item.businessCategory,
              riskRating: item.riskRating,
              Year: item.Year,
              Lat: item.Lat,
              Long: item.Long,
              earthquake: item.riskFactors.Earthquake,
              extremeHeat: item.riskFactors["Extreme heat"],
              tornado: item.riskFactors.Tornado,
              flooding: item.riskFactors.Flooding,
              hurricane: item.riskFactors.Hurricane,
              extremeCold: item.riskFactors["Extreme cold"],
              wildfire: item.riskFactors.Wildfire,
              volcano: item.riskFactors.Volcano,
              drought: item.riskFactors.Drought,
              seaLevelRise: item.riskFactors["Sea level rise"],
            },
            label: item.assetName,
          };
      })
  );
  const allDatasets: any = {};
  const [allDatasetsFinal, setAllDatasetsFinal] = useState(
    rowData.map((item) => {
      if (
        !allDatasets.hasOwnProperty(
          `${item?.item.assetName}_${item?.item?.businessCategory}_${item?.item.Lat}_${item?.item.Long}`
        )
      ) {
        return Object.assign(allDatasets, {
          [`${item?.item.assetName}_${item?.item?.businessCategory}_${item?.item.Lat}_${item?.item.Long}`]:
            [item?.item],
        });
      } else {
        allDatasets[
          `${item?.item.assetName}_${item?.item?.businessCategory}_${item?.item.Lat}_${item?.item.Long}`
        ].push(item?.item);
      }
    })
  );

  let finalLineData: any[] = [];
  for (let singleData in allDatasets) {
    // if singleData doesn't contain all the years, add the missing years with riskRating 0
    for (let i = 0; i < yearList.length; i++) {
      let yearExists = false;
      for (let j = 0; j < allDatasets[singleData].length; j++) {
        if (allDatasets[singleData][j].Year === yearList[i]) {
          yearExists = true;
          break;
        }
      }
      if (!yearExists) {
        allDatasets[singleData].push({
          id: "",
          assetName: allDatasets[singleData][0].assetName,
          businessCategory: allDatasets[singleData][0].businessCategory,
          riskRating: 0,
          Year: yearList[i],
          Lat: allDatasets[singleData][0].Lat,
          Long: allDatasets[singleData][0].Long,
          earthquake: 0,
          extremeHeat: 0,
          tornado: 0,
          flooding: 0,
          hurricane: 0,
          extremeCold: 0,
          wildfire: 0,
          volcano: 0,
          drought: 0,
          seaLevelRise: 0,
        });
      }
    }
    singleData = allDatasets[singleData].sort(
      (a: any, b: any) => a.Year - b.Year
    );
    finalLineData.push(singleData);
  }

  const [riskData, setRiskData] = useState({
    labels: yearList,
    datasets: finalLineData.map((item: any) => {
      return {
        label: `${item[0].assetName}: ${item[0].businessCategory}. Risk Rating`,
        data: item.map((data: any) => data.riskRating),
      };
    }),

    // return item.map((data: any) => {
    //   return {
    //     label: `${data.assetName}. Earthquake: ${data.earthquake}, Extreme Heat: ${data.extremeHeat}, Tornado: ${data.tornado}, Flooding: ${data.flooding}, Hurricane: ${data.hurricane}, Extreme Cold: ${data.extremeCold}, Wildfire: ${data.wildfire}, Volcano: ${data.volcano}, Drought: ${data.drought}, Sea Level Rise: ${data.seaLevelRise}. Total`,
    //     data: data.riskRating,
    //   };
    // });
  });

  return (
    <div className="flex w-[80%] m-auto my-8 justify-center items-center flex-col gap-4 flex-wrap">
      <div className=" text-xl">
        Line Chart for all years, for{" "}
        <span className=" font-bold">
          {selectedAsset.length > 0 ? selectedAsset : "all Assets"}
        </span>{" "}
        in{" "}
        <span className=" font-bold">
          {selectedBusiness.length > 0 ? selectedBusiness : "all categories"}
        </span>{" "}
        at{" "}
        <span className=" font-bold">
          {selectedLocation.length > 0 ? selectedLocation.replace(",", ", ") : "all locations"}
        </span>
        .
      </div>
      <Line
        data={riskData}
        options={{ plugins: { legend: { display: false } } }}
      />
    </div>
  );
};

export default LineChart;
