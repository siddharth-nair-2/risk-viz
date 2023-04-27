"use client";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { RiskData } from "../interface/RiskData";
import { useCallback, useMemo, useRef, useState } from "react";
import { ColDef } from "ag-grid-community";

interface DataTableProps {
  finalData: RiskData[];
  selectedYear: string;
  selectedAsset: string;
  selectedBusiness: string;
  selectedLocation: string;
}

const DataTable: React.FC<DataTableProps> = ({
  finalData,
  selectedYear,
  selectedAsset,
  selectedBusiness,
  selectedLocation,
}) => {
  const finalRowData: any[] = [];
  const [rowData, setRowData] = useState(
    finalData
      .filter((data) => data.Year === selectedYear)
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
      .map((riskData) =>
        finalRowData.push({
          id: riskData.id,
          assetName: riskData.assetName,
          businessCategory: riskData.businessCategory,
          riskRating: riskData.riskRating,
          Year: riskData.Year,
          Lat: riskData.Lat,
          Long: riskData.Long,
          earthquake: riskData.riskFactors.Earthquake?.toFixed(2),
          extremeHeat: riskData.riskFactors["Extreme heat"]?.toFixed(2),
          tornado: riskData.riskFactors.Tornado?.toFixed(2),
          flooding: riskData.riskFactors.Flooding?.toFixed(2),
          hurricane: riskData.riskFactors.Hurricane?.toFixed(2),
          extremeCold: riskData.riskFactors["Extreme cold"]?.toFixed(2),
          wildfire: riskData.riskFactors.Wildfire?.toFixed(2),
          volcano: riskData.riskFactors.Volcano?.toFixed(2),
          drought: riskData.riskFactors.Drought?.toFixed(2),
          seaLevelRise: riskData.riskFactors["Sea level rise"]?.toFixed(2),
        })
      )
  );

  const gridRef = useRef<AgGridReact>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "#",
      maxWidth: 70,
      field: "id",
    },
    {
      headerName: "Asset Name",
      minWidth: 250,
      field: "assetName",
    },
    {
      headerName: "Business Category",
      minWidth: 180,
      field: "businessCategory",
    },
    {
      headerName: "Risk Rating",
      minWidth: 150,
      field: "riskRating",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Earthquake",
      minWidth: 150,
      field: "earthquake",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Extreme Heat",
      minWidth: 150,
      field: "extremeHeat",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Tornado",
      minWidth: 150,
      field: "tornado",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Flooding",
      minWidth: 150,
      field: "flooding",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Hurricane",
      minWidth: 150,
      field: "hurricane",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Extreme Cold",
      minWidth: 150,
      field: "extremeCold",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Wildfire",
      minWidth: 150,
      field: "wildfire",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Volcano",
      minWidth: 150,
      field: "volcano",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Drought",
      minWidth: 150,
      field: "drought",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Sea Level Rise",
      minWidth: 150,
      field: "seaLevelRise",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Latitude",
      minWidth: 150,
      field: "Lat",
    },
    {
      headerName: "Longitude",
      minWidth: 150,
      field: "Long",
    },
    {
      headerName: "Year",
      minWidth: 80,
      field: "Year",
    },
  ]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onFilterTextBoxChanged = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      gridRef.current!.api.setQuickFilter(e.currentTarget.value);
    },
    []
  );
  if (!rowData) return <div>Loading...</div>;

  return (
    <div className="flex w-[80%] m-auto my-8 justify-center items-center flex-col gap-4">
      <input
        type="text"
        id="filter-text-box"
        placeholder="Filter table..."
        onChange={onFilterTextBoxChanged}
        className=" w-80 border-2 border-black rounded-md p-2"
      />
      <div className="ag-theme-alpine w-full h-[500px]">
        <AgGridReact
          ref={gridRef}
          rowData={finalRowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cacheQuickFilter={true}
          pagination={true}
          paginationPageSize={10}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default DataTable;
