import React from "react";
import styles from "./DropRateZone.module.css";

const getInitials = (name) =>{
  if (!name || typeof name !== 'string') return '';
  
  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single word → first 3 letters
    return words[0].slice(0, 3).toUpperCase();
  }
  
  // Multiple words → first letter of first two words
  return (words[0][0] + (words[1]?.[0] || '')).toUpperCase();
}
 
const DropRateZone = ({ title = "", zoneData = [], progressBarClass = "" }) => {


  return (
    <div className={styles.drop_rate_container}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.unordered_list}>
        {zoneData.map((zone, index) => (
          <li key={index} className={styles.zone_row}>
            {/* UPDATED LINE BELOW: Extracts first 3 letters and makes them uppercase */}
            <div className={styles.zone_indicator}>
              {/* {zone.name ? zone.name.substring(0, 3).toUpperCase() : ""} */}
              {getInitials(zone.name)}
            </div>
           
            <div className={styles.zone_details}>
              <label className={styles.zone_name}>{zone.name}</label>
              <div className={styles.progress_container}>
                <div className={styles.progress_bar}>
                  <div
                    className={`${styles.progress} ${progressBarClass}`}
                    style={{ width: `${zone.rate}%` }}
                  />
                </div>
                <span className={styles.rate}>{zone.rate}%</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
 
export default DropRateZone;
 