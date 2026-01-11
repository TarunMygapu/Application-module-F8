import React from "react";
import styles from "./CollegeOverviewConWrtAppl.module.css";

const CollegeOverviewConWrtAppl = ({ data }) => {
  // Find the concession object that has pro concession data (proAmount, proReason, proGivenById)
  const concessions = data?.concessions || [];
  const proConcessionData = concessions.find(concession =>
    concession?.proAmount !== null &&
    concession?.proAmount !== undefined &&
    concession?.proAmount !== 0
  ) || {};

  // Extract pro concession fields
  const concessionAmount = proConcessionData?.proAmount || '-';
  const concessionReferredBy = proConcessionData?.proGivenByName || proConcessionData?.proGivenById || '-';
  const reason = proConcessionData?.proReason || '-';

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
          <span className={styles.value}>{concessionAmount}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Concession Referred By</span>
          <span className={styles.value}>{concessionReferredBy}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Reason</span>
          <span className={styles.value}>{reason}</span>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewConWrtAppl;
