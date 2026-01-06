import React from "react";
import styles from "./CollegeOverviewAcademicInfo.module.css";

const CollegeOverviewAcademicInfo = ({ data }) => {
  console.log("🚀 ~ CollegeOverviewAcademicInfo ~ data:", data)
  return (
    <div className={styles.wrapper}>
      {/* Title + line */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Academic Information</span>
        <div className={styles.line}></div>
      </div>

      {/* Content grid */}
      <div className={styles.infoGrid}>
        {data?.hallTicketNo && (
          <div className={styles.infoItem}>
            <span className={styles.label}>10th Hall Ticket Number</span>
            <span className={styles.value}>{data.hallTicketNo}</span>
          </div>
        )}

        {data?.preHallTicketNo && (
          <div className={styles.infoItem}>
            <span className={styles.label}>Inter 1st Year Hall Ticket Number</span>
            <span className={styles.value}>{data.preHallTicketNo}</span>
          </div>
        )}

        {/* If neither exists */}
        {!data?.preHallTicketNo && !data?.hallTicketNo && (
          <div className={styles.infoItem}>
            <span className={styles.label}>Hall Ticket Number</span>
            <span className={styles.value}>-</span>
          </div>
        )}

        <div className={styles.infoItem}>
          <span className={styles.label}>{data?.preSchoolStateName
            ? "School State"
            : data?.preCollegeStateName
              ? "College State"
              : "State"}</span>
          <span className={styles.value}>{data?.preSchoolStateName || data?.preCollegeStateName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>{data?.preSchoolDistrictName
            ? "School District"
            : data?.preCollegeDistrictName
              ? "College District"
              : "District"}</span>
          <span className={styles.value}>{data?.preSchoolDistrictName || data?.preCollegeDistrictName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>{data?.preSchoolTypeName
            ? "School Type"
            : data?.preCollegeTypeName
              ? "College Type"
              : "Type"}</span>
          <span className={styles.value}>{data?.schoolTypeName || data?.preSchoolTypeName || data?.preCollegeTypeName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>{data?.preSchoolName
            ? "School Name"
            : data?.preCollegeName
              ? "College Name"
              : "Name"}</span>
          <span className={styles.value}>{data?.preSchoolName || data?.preCollegeName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Score App No</span>
          <span className={styles.value}>{data?.scoreAppNo || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Score Marks</span>
          <span className={styles.value}>{data?.scoreMarks || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Food type</span>
          <span className={styles.value}>{data?.foodTypeName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Blood Group</span>
          <span className={styles.value}>{data?.bloodGroupName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Caste</span>
          <span className={styles.value}>{data?.casteName || '-'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Religion</span>
          <span className={styles.value}>{data?.religionName || '-'}</span>
        </div>
      </div>
    </div>
  );
};

export default CollegeOverviewAcademicInfo;
