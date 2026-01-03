import React from "react";
import styles from "./PopupHeader.module.css";

const PopupHeader = ({ step, onClose, title, totalSteps = 3 }) => {
  // Generate segments dynamically based on totalSteps
  const segments = Array.from({ length: totalSteps }, (_, index) => index + 1);
  
  return (
    <div className={styles.headerContainer}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.stepContainer}>
          <span className={styles.stepLabel}>Step:</span>
          <span className={styles.stepNumber}>{step}</span>
        </div>
        <div className={styles.progressBar}>
          {segments.map((segmentNumber) => (
            <div 
              key={segmentNumber}
              className={`${styles.segment} ${step >= segmentNumber ? styles.segmentActive : ''}`}
            ></div>
          ))}
        </div>
      </div>

      <button className={styles.closeBtn} onClick={onClose}>✕</button>
    </div>
  );
};

export default PopupHeader;
