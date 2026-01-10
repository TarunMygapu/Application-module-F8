import React, { useState } from "react";
import styles from "./FileExport.module.css";
import ConfirmationModal from "./ConfirmationModal";
import {
  exportToPDF,
  exportToXLS,
  exportToDOC,
  getSelectedRecords,
  hasSelectedRecords,
} from "./utils/exportUtils";
 
const FileExport = ({ onExport,exportConfig, data = [], position = "middle" }) => {
  const [selectedType, setSelectedType] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingType, setPendingType] = useState(null);
  const fileTypes = ["PDF", ".XLS", ".DOC"];
 
  const handleSelect = (type) => {
    setSelectedType(type);

    console.log("Rows received for export:", data);

    if (!data || data.length === 0) {
      alert("No rows selected for export!");
      return;
    }

    // Normalize and show confirmation modal for any file type
    const normalized = String(type).toLowerCase();
    setPendingType(normalized);
    setShowConfirmModal(true);
    return;
  };

  const handleConfirmExport = () => {
    const { headers, fields } = exportConfig || {};
    if (!pendingType) return;

    if (pendingType === "pdf") {
      exportToPDF(data, headers, fields);
      onExport?.("PDF", data);
    } else if (pendingType === "xls") {
      exportToXLS(data, headers, fields);
      onExport?.("XLS", data);
    } else if (pendingType === "doc") {
      exportToDOC(data, headers, fields);
      onExport?.("DOC", data);
    }

    setShowConfirmModal(false);
    setPendingType(null);
  };

  const handleCancelExport = () => {
    setShowConfirmModal(false);
    setPendingType(null);
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
      {/* Confirmation modal for PDF export */}
      <ConfirmationModal
        open={showConfirmModal}
        title="Download PDF"
        message="Downloading PDF. Press OK to continue."
        onConfirm={handleConfirmExport}
        onCancel={handleCancelExport}
      />
    </div>
  );
};
 
export default FileExport;