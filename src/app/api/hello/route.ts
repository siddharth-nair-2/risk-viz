import path from "path";
import { promises as fs } from "fs";
import * as xlsx from "xlsx";

export async function GET(request: Request) {
  const jsonDirectory = path.join(process.cwd(), "");
  //Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + "/public/sample_data.xlsx"
  );
  const excelFile = xlsx.read(fileContents);
  const excelSheet = excelFile.Sheets[excelFile.SheetNames[0]];
  const exceljson = xlsx.utils.sheet_to_json(excelSheet);
  return new Response(JSON.stringify(exceljson));
}
