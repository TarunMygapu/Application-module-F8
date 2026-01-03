import React from "react";
import styles from "./CollegeOverviewConWrtAppl.module.css";

const CollegeOverviewConWrtAppl = ({ data }) => {
  console.log('📝 CollegeOverviewConWrtAppl - Received data:', data);
  
  // Access the concessions array and get the second concession (index 1)
  const concessionData = data?.concessions?.[1] || {};
  
  return (
    <div className={styles.wrapper}>
      {/* Title + Divider */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Concession Written On Application</span>
        <div className={styles.line}></div>
      </div>

      {/* GRID */}
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Concession Amount</span>
          <span className={styles.value}>{concessionData?.amount || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Concession Referred By</span>
          <span className={styles.value}>{concessionData?.concReferedByName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Reason</span>
          <span className={styles.value}>{concessionData?.reasonName || '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewConWrtAppl;
