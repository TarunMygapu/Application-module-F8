import React from "react";
import styles from "./CollegeOverviewConceInfo.module.css";

const CollegeOverviewConceInfo = ({ concessionsData = [] }) => {
  console.log(
    "👁️ CollegeOverviewConceInfo - Received concessionsData:",
    concessionsData
  );
  console.log(
    "👁️ CollegeOverviewConceInfo - concessionsData type:",
    typeof concessionsData
  );
  console.log(
    "👁️ CollegeOverviewConceInfo - concessionsData length:",
    concessionsData?.length
  );
  console.log(
    "👁️ CollegeOverviewConceInfo - Is array?",
    Array.isArray(concessionsData)
  );

  return (
    <div className={styles.wrapper}>
      {/* Title + Divider */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Concession Information</span>
        <div className={styles.line}></div>
      </div>

      {/* GRID */}
      <div className={styles.infoGrid}>
        {concessionsData?.[0]?.concessionTypeId && <div className={styles.infoItem}>
          <span className={styles.label}>1st Year Concession</span>
          <span className={styles.value}>{concessionsData?.[1]?.amount || "-"}</span>
        </div>}

        {concessionsData?.[1]?.concessionTypeId && <div className={styles.infoItem}>
          <span className={styles.label}>2nd Year Concession</span>
          <span className={styles.value}>{concessionsData?.[1]?.amount || "-"}</span>
        </div>}

        {concessionsData?.[2]?.concessionTypeId && <div className={styles.infoItem}>
          <span className={styles.label}>3rd Year Concession</span>
          <span className={styles.value}>-</span>
        </div>}

        <div className={styles.infoItem}>
          <span className={styles.label}>Referred By</span>
          <span className={styles.value}>
            {concessionsData?.[0]?.concReferedByName || "-"}
          </span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Description</span>
          <span className={styles.value}>
            {concessionsData?.[0]?.comments || "-"}
          </span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Authorized By</span>
          <span className={styles.value}>
            {concessionsData?.[0]?.authorizedByName || "-"}
          </span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Reason</span>
          <span className={styles.value}>
            {concessionsData?.[0]?.reasonName || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewConceInfo;
