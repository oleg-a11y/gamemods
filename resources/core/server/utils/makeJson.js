import fs from "fs";
import * as alt from "alt-server";
import path from "path";

export function loadDataJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");

      if (!data || data.trim() === "") {
        return {};
      }

      return JSON.parse(data);
    }
  } catch (error) {
    alt.logError(`Error loading data from ${filePath}: ${error.message}`);
  }
  return {};
}

export function saveDataJson(filePath, data) {
  try {
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    alt.logError(`Error saving data to ${filePath}: ${error.message}`);
    return false;
  }
}
