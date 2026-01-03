import React, { useState } from "react";
import styles from "./FileExport.module.css";
import {
  exportToPDF,
  exportToXLS,
  exportToDOC,
  getSelectedRecords,
  hasSelectedRecords,
} from "./utils/exportUtils";
 
const FileExport = ({ onExport,exportConfig, data = [], position = "middle" }) => {
  const [selectedType, setSelectedType] = useState("");
  const fileTypes = ["PDF", ".xls", "doc"];
 
  const handleSelect = (type) => {
  setSelectedType(type);
 
  console.log("Rows received for export:", data);
 
  if (!data.length) {
    alert("No rows selected for export!");
    return;
  }
 
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const filename = `application-status-${timestamp}`;
  const { headers, fields } = exportConfig;
 
  switch (type) {
    case "PDF":
      exportToPDF(data, headers, fields);
      break;
    case ".xls":
      exportToXLS(data, headers, fields);
      break;
    case "doc":
      exportToDOC(data, headers, fields);
      break;
  }
 
  onExport?.(type, data);
};
 
 
  const hasSelection = data.length > 0;
 
  return (
    <div
      className={`${styles.exportContainer} ${
        position === "left"
          ? styles.leftPosition
          : position === "right"
          ? styles.rightPosition
          : styles.middlePosition
      }`}
    >
      <div className={styles.fileTypeWrapper}>
        <span className={styles.fileTypeLabel}>File Type</span>
        <div className={styles.fileTypeOptions}>
          {fileTypes.map((type) => (
            <button
              key={type}
              className={`${styles.fileTypeBtn} ${
                selectedType === type ? styles.active : ""
              }`}
              onClick={() => handleSelect(type)}
              disabled={!hasSelection}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default FileExport;